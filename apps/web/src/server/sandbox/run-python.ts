import { runInDocker } from "./docker-runner";
import { buildPythonHarness, type PythonHarnessInput } from "./python-harness";

export interface CaseResult {
  index: number;
  pass: boolean;
  actual?: unknown;
  error?: string;
}

export interface RunResult {
  results: CaseResult[];
  allPassed: boolean;
  compileError?: string;
  timedOut?: boolean;
}

export async function runPython(input: PythonHarnessInput): Promise<RunResult> {
  const { mainPy, testcasesJson } = buildPythonHarness(input);

  const result = await runInDocker({
    image: "python:3.11-slim",
    files: [
      { name: "main.py", content: mainPy },
      { name: "testcases.json", content: testcasesJson },
    ],
    cmd: ["python3", "main.py"],
    timeoutMs: 5000,
  });

  if (result.timedOut) {
    return {
      results: input.testCases.map((_, index) => ({
        index,
        pass: false,
        error: "Time limit exceeded — check for an infinite loop.",
      })),
      allPassed: false,
      timedOut: true,
    };
  }

  if (result.exitCode !== 0) {
    return {
      results: [],
      allPassed: false,
      compileError: result.stderr.trim() || "Python process exited with an error.",
    };
  }

  try {
    const lastLine = result.stdout.trim().split("\n").pop() ?? "{}";
    const parsed = JSON.parse(lastLine) as { results: CaseResult[] };
    return { results: parsed.results, allPassed: parsed.results.every((r) => r.pass) };
  } catch {
    return {
      results: [],
      allPassed: false,
      compileError: `Could not parse output.\nstdout: ${result.stdout}\nstderr: ${result.stderr}`,
    };
  }
}
