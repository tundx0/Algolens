"use client";

import type { StructureTransform, TestCase } from "@algolens/exercises";
import { useCallback, useRef } from "react";
import { buildWorkerSource } from "@/lib/exercise-worker-source";

const TIMEOUT_MS = 3000;

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

/**
 * Runs user code in a dedicated Worker so an infinite loop can never freeze
 * the page — if the worker doesn't answer within TIMEOUT_MS we terminate it
 * outright (the only way to stop synchronous JS from outside its own
 * thread) and report a timeout instead of hanging forever.
 */
export function useExerciseRunner() {
  const workerUrlRef = useRef<string | null>(null);

  const run = useCallback(
    (
      code: string,
      functionName: string,
      testCases: TestCase[],
      argTransform?: StructureTransform,
      resultTransform?: StructureTransform,
    ): Promise<RunResult> => {
      return new Promise((resolve) => {
        if (!workerUrlRef.current) {
          const blob = new Blob([buildWorkerSource()], {
            type: "application/javascript",
          });
          workerUrlRef.current = URL.createObjectURL(blob);
        }
        const worker = new Worker(workerUrlRef.current);
        let settled = false;

        const timer = setTimeout(() => {
          if (settled) return;
          settled = true;
          worker.terminate();
          resolve({
            results: testCases.map((_, index) => ({
              index,
              pass: false,
              error: "Time limit exceeded — check for an infinite loop.",
            })),
            allPassed: false,
            timedOut: true,
          });
        }, TIMEOUT_MS);

        worker.onmessage = (e) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          worker.terminate();

          if (e.data.compileError) {
            resolve({
              results: [],
              allPassed: false,
              compileError: e.data.compileError,
            });
            return;
          }

          const results: CaseResult[] = e.data.results;
          resolve({ results, allPassed: results.every((r) => r.pass) });
        };

        worker.onerror = (e) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          worker.terminate();
          resolve({
            results: [],
            allPassed: false,
            compileError: e.message,
          });
        };

        worker.postMessage({
          code,
          functionName,
          testCases,
          argTransform,
          resultTransform,
        });
      });
    },
    [],
  );

  return { run };
}
