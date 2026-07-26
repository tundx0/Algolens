import type { ArrayState, VisualizationStep } from "@algolens/viz-engine";
import type { AlgorithmDefinition } from "../definition";

const javascript = `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`;

const python = `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`;

const java = `static int[] bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
    return arr;
}`;

const lines = {
  start: { javascript: 1, python: 1, java: 1 },
  compare: { javascript: 6, python: 6, java: 6 },
  swap: { javascript: 7, python: 7, java: 7 },
  passEnd: { javascript: 10, python: 8, java: 12 },
  earlyExit: { javascript: 12, python: 9, java: 14 },
  done: { javascript: 14, python: 11, java: 16 },
} as const;

function snapshot(
  values: number[],
  ids: number[],
  sorted: number[],
  extra: Partial<ArrayState> = {},
): ArrayState {
  return {
    kind: "array",
    values: [...values],
    ids: [...ids],
    sorted: [...sorted],
    ...extra,
  };
}

function* generateSteps(input: number[]): Generator<VisualizationStep> {
  const values = [...input];
  const ids = values.map((_, i) => i);
  const sorted: number[] = [];
  const n = values.length;

  yield {
    description: `Start with ${n} unsorted elements. Each pass bubbles the largest remaining value to the end.`,
    state: snapshot(values, ids, sorted),
    codeLine: lines.start,
  };

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - 1 - i; j++) {
      const a = values[j] as number;
      const b = values[j + 1] as number;

      yield {
        description: `Compare a[${j}]=${a} with a[${j + 1}]=${b}: ${
          a > b ? `${a} > ${b}, out of order` : `${a} ≤ ${b}, already in order`
        }.`,
        highlightIndices: [j, j + 1],
        state: snapshot(values, ids, sorted, {
          compare: [j, j + 1],
          pointers: { j },
        }),
        codeLine: lines.compare,
      };

      if (a > b) {
        [values[j], values[j + 1]] = [b, a];
        [ids[j], ids[j + 1]] = [ids[j + 1] as number, ids[j] as number];
        swapped = true;

        yield {
          description: `Swap ${a} and ${b}.`,
          highlightIndices: [j, j + 1],
          state: snapshot(values, ids, sorted, {
            swap: [j, j + 1],
            pointers: { j },
          }),
          codeLine: lines.swap,
          metadata: { event: "swap" },
        };
      }
    }

    sorted.push(n - 1 - i);
    yield {
      description: `Pass ${i + 1} complete — ${values[n - 1 - i]} is in its final position.`,
      state: snapshot(values, ids, sorted),
      codeLine: lines.passEnd,
      metadata: { event: "pass-end" },
    };

    if (!swapped) {
      for (let k = n - 2 - i; k >= 0; k--) sorted.push(k);
      yield {
        description: "No swaps in this pass — the array is already sorted, so we stop early.",
        state: snapshot(values, ids, sorted),
        codeLine: lines.earlyExit,
      };
      break;
    }
  }

  if (sorted.length < n) {
    for (let k = 0; k < n; k++) if (!sorted.includes(k)) sorted.push(k);
  }

  yield {
    description: "Done — every element is in order.",
    state: snapshot(values, ids, sorted),
    codeLine: lines.done,
    metadata: { event: "complete" },
  };
}

export const bubbleSort: AlgorithmDefinition<number[]> = {
  id: "bubble-sort",
  name: "Bubble sort",
  category: "sorting",
  difficulty: "beginner",
  timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
  spaceComplexity: "O(1)",
  defaultInput: [7, 3, 9, 4, 6, 2, 8, 5],
  generateSteps,
  codeImplementations: { javascript, python, java },
};
