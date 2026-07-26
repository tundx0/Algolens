import type { ArrayState, VisualizationStep } from "@algolens/viz-engine";
import type { AlgorithmDefinition } from "../definition";

const javascript = `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`;

const python = `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`;

const java = `static int[] insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}`;

const lines = {
  start: { javascript: 1, python: 1, java: 1 },
  compare: { javascript: 5, python: 5, java: 5 },
  shift: { javascript: 6, python: 6, java: 6 },
  place: { javascript: 9, python: 8, java: 9 },
  done: { javascript: 11, python: 9, java: 11 },
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
  const n = values.length;

  yield {
    description: `Start with ${n} elements. a[0] is trivially sorted; each new element is inserted into the sorted prefix.`,
    state: snapshot(values, ids, [0]),
    codeLine: lines.start,
  };

  for (let i = 1; i < n; i++) {
    const key = values[i] as number;
    const keyId = ids[i] as number;
    let j = i - 1;

    yield {
      description: `Pick up a[${i}]=${key} to insert into the sorted prefix [0..${i - 1}].`,
      state: snapshot(values, ids, [], {
        pivot: i,
        range: [0, i - 1],
      }),
      codeLine: lines.start,
    };

    while (j >= 0 && (values[j] as number) > key) {
      yield {
        description: `a[${j}]=${values[j]} > ${key}, shift it right.`,
        highlightIndices: [j, j + 1],
        state: snapshot(values, ids, [], {
          compare: [j, j + 1],
          pointers: { i, j },
          range: [0, i],
        }),
        codeLine: lines.compare,
      };

      values[j + 1] = values[j] as number;
      ids[j + 1] = ids[j] as number;
      j--;

      yield {
        description: "Shifted.",
        state: snapshot(values, ids, [], { pointers: { i, j }, range: [0, i] }),
        codeLine: lines.shift,
        metadata: { event: "swap" },
      };
    }

    values[j + 1] = key;
    ids[j + 1] = keyId;

    yield {
      description: `Place ${key} at position ${j + 1}.`,
      state: snapshot(values, ids, [], { pivot: j + 1, range: [0, i] }),
      codeLine: lines.place,
      metadata: { event: "pass-end" },
    };
  }

  yield {
    description: "Done — every element is in order.",
    state: snapshot(
      values,
      ids,
      Array.from({ length: n }, (_, k) => k),
    ),
    codeLine: lines.done,
    metadata: { event: "complete" },
  };
}

export const insertionSort: AlgorithmDefinition<number[]> = {
  id: "insertion-sort",
  name: "Insertion sort",
  category: "sorting",
  difficulty: "beginner",
  timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
  spaceComplexity: "O(1)",
  defaultInput: [7, 3, 9, 4, 6, 2, 8, 5],
  generateSteps,
  codeImplementations: { javascript, python, java },
};
