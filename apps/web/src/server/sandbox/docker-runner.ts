import { randomUUID } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";

export interface SandboxFile {
  name: string;
  content: string;
}

export interface RunInDockerOptions {
  image: string;
  files: SandboxFile[];
  cmd: string[];
  timeoutMs?: number;
  memoryMb?: number;
  cpus?: number;
  pidsLimit?: number;
}

export interface DockerRunResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
}

const MAX_CAPTURED_OUTPUT = 64 * 1024;

/**
 * Runs untrusted code in a short-lived, network-isolated, resource-capped
 * Docker container — no `isolate` dependency (see judge0 investigation:
 * its bundled sandbox binary doesn't run on this host). Docker's own
 * cgroup-v2-native limits do the isolation instead.
 *
 * Infinite loops are stopped the only way possible from outside the
 * container's own thread of execution: an external timer that runs
 * `docker kill` on the container, same principle as the browser Worker path.
 */
export async function runInDocker(options: RunInDockerOptions): Promise<DockerRunResult> {
  const {
    image,
    files,
    cmd,
    timeoutMs = 5000,
    memoryMb = 128,
    cpus = 0.5,
    pidsLimit = 64,
  } = options;

  const dir = await mkdtemp(join(tmpdir(), "algolens-sandbox-"));
  const containerName = `algolens-sbx-${randomUUID()}`;

  try {
    for (const file of files) {
      await writeFile(join(dir, file.name), file.content, "utf8");
    }

    const args = [
      "run",
      "--rm",
      "--name",
      containerName,
      "--network",
      "none",
      "--memory",
      `${memoryMb}m`,
      "--memory-swap",
      `${memoryMb}m`,
      "--cpus",
      String(cpus),
      "--pids-limit",
      String(pidsLimit),
      "--security-opt",
      "no-new-privileges",
      "--cap-drop",
      "ALL",
      "--read-only",
      "--tmpfs",
      "/tmp:rw,size=16m",
      "-v",
      `${dir}:/sandbox:ro`,
      "-w",
      "/sandbox",
      image,
      ...cmd,
    ];

    return await new Promise<DockerRunResult>((resolve) => {
      const child = spawn("docker", args, { stdio: ["ignore", "pipe", "pipe"] });
      let stdout = "";
      let stderr = "";
      let timedOut = false;
      let settled = false;

      child.stdout.on("data", (d: Buffer) => {
        if (stdout.length < MAX_CAPTURED_OUTPUT) stdout += d.toString();
      });
      child.stderr.on("data", (d: Buffer) => {
        if (stderr.length < MAX_CAPTURED_OUTPUT) stderr += d.toString();
      });

      const timer = setTimeout(() => {
        timedOut = true;
        spawn("docker", ["kill", containerName], { stdio: "ignore" });
      }, timeoutMs);

      child.on("close", (code) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve({ stdout, stderr, exitCode: code, timedOut });
      });

      child.on("error", (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve({ stdout, stderr: `${stderr}\n${err.message}`, exitCode: null, timedOut });
      });
    });
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
