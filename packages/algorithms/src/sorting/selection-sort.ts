import type { ArrayState, VisualizationStep } from "@algolens/viz-engine";
import type { AlgorithmDefinition } from "../definition";

const javascript = `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[min]) min = j;
    }
    if (min !== i) {
      [arr[i], arr[min]] = [arr[min], arr[i]];
    }
  }
  return arr;
}`;

const python = `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`;

const java = `static int[] selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int min = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min]) min = j;
        }
        if (min != i) {
            int tmp = arr[i];
            arr[i] = arr[min];
            arr[min] = tmp;
        }
    }
    return arr;
}`;

const lines = {
  start: { javascript: 1, python: 1, java: 1 },
  compare: { javascript: 6, python: 6, java: 6 },
  newMin: { javascript: 6, python: 6, java: 6 },
  swap: { javascript: 9, python: 8, java: 9 },
  passEnd: { javascript: 3, python: 3, java: 3 },
  done: { javascript: 13, python: 10, java: 14 },
} as const;

function snapshot(
  values: number[],
  ids: number[],
  sorted: number[],
  extra: Partial<ArrayState> = {},
): ArrayState {
  return { kind: "array", values: [...values], ids: [...ids], sorted: [...sorted], ...extra };
}

function* generateSteps(input: number[]): Generator<VisualizationStep> {
  const values = [...input];
  const ids = values.map((_, i) => i);
  const sorted: number[] = [];
  const n = values.length;

  yield {
    description: `Start with ${n} unsorted elements. Each pass finds the minimum of the unsorted region and moves it to the front.`,
    state: snapshot(values, ids, sorted),
    codeLine: lines.start,
  };

  for (let i = 0; i < n - 1; i++) {
    let min = i;

    for (let j = i + 1; j < n; j++) {
      yield {
        description: `Compare a[${j}]=${values[j]} with current minimum a[${min}]=${values[min]}.`,
        highlightIndices: [j, min],
        state: snapshot(values, ids, sorted, {
          compare: [j, min],
          pointers: { i, j, min },
          range: [i, n - 1],
        }),
        codeLine: lines.compare,
      };

      if ((values[j] as number) < (values[min] as number)) {
        min = j;
        yield {
          description: `${values[j]} is the new minimum.`,
          state: snapshot(values, ids, sorted, {
            pivot: min,
            pointers: { i, j, min },
            range: [i, n - 1],
          }),
          codeLine: lines.newMin,
        };
      }
    }

    if (min !== i) {
      [values[i], values[min]] = [values[min] as number, values[i] as number];
      [ids[i], ids[min]] = [ids[min] as number, ids[i] as number];
      yield {
        description: `Swap a[${i}] with the minimum found at a[${min}].`,
        state: snapshot(values, ids, sorted, {
          swap: [i, min],
          pointers: { i },
          range: [i, n - 1],
        }),
        codeLine: lines.swap,
        metadata: { event: "swap" },
      };
    }

    sorted.push(i);
    yield {
      description: `a[${i}]=${values[i]} is now in its final position.`,
      state: snapshot(values, ids, sorted),
      codeLine: lines.passEnd,
      metadata: { event: "pass-end" },
    };
  }

  sorted.push(n - 1);
  yield {
    description: "Done — every element is in order.",
    state: snapshot(values, ids, sorted),
    codeLine: lines.done,
    metadata: { event: "complete" },
  };
}

export const selectionSort: AlgorithmDefinition<number[]> = {
  id: "selection-sort",
  name: "Selection sort",
  category: "sorting",
  difficulty: "beginner",
  timeComplexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
  spaceComplexity: "O(1)",
  defaultInput: [7, 3, 9, 4, 6, 2, 8, 5],
  generateSteps,
  codeImplementations: { javascript, python, java },
};
