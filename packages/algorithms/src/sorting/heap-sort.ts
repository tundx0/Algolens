import type { ArrayState, VisualizationStep } from "@algolens/viz-engine";
import type { AlgorithmDefinition } from "../definition";

const javascript = `function heapSort(arr) {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    siftDown(arr, i, n);
  }
  for (let end = n - 1; end > 0; end--) {
    [arr[0], arr[end]] = [arr[end], arr[0]];
    siftDown(arr, 0, end);
  }
  return arr;
}

function siftDown(arr, i, size) {
  let largest = i;
  const l = 2 * i + 1, r = 2 * i + 2;
  if (l < size && arr[l] > arr[largest]) largest = l;
  if (r < size && arr[r] > arr[largest]) largest = r;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    siftDown(arr, largest, size);
  }
}`;

const python = `def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        sift_down(arr, i, n)
    for end in range(n - 1, 0, -1):
        arr[0], arr[end] = arr[end], arr[0]
        sift_down(arr, 0, end)
    return arr

def sift_down(arr, i, size):
    largest = i
    l, r = 2 * i + 1, 2 * i + 2
    if l < size and arr[l] > arr[largest]:
        largest = l
    if r < size and arr[r] > arr[largest]:
        largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        sift_down(arr, largest, size)`;

const java = `static void heapSort(int[] arr) {
    int n = arr.length;
    for (int i = n / 2 - 1; i >= 0; i--) siftDown(arr, i, n);
    for (int end = n - 1; end > 0; end--) {
        int tmp = arr[0]; arr[0] = arr[end]; arr[end] = tmp;
        siftDown(arr, 0, end);
    }
}

static void siftDown(int[] arr, int i, int size) {
    int largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < size && arr[l] > arr[largest]) largest = l;
    if (r < size && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        int tmp = arr[i]; arr[i] = arr[largest]; arr[largest] = tmp;
        siftDown(arr, largest, size);
    }
}`;

const lines = {
  build: { javascript: 3, python: 3, java: 3 },
  extract: { javascript: 7, python: 6, java: 5 },
  compare: { javascript: 17, python: 16, java: 12 },
  swap: { javascript: 21, python: 20, java: 17 },
  done: { javascript: 10, python: 9, java: 3 },
};

function snapshot(
  values: number[],
  ids: number[],
  sorted: number[],
  heapSize: number,
  extra: Partial<ArrayState> = {},
): ArrayState {
  return {
    kind: "array",
    values: [...values],
    ids: [...ids],
    sorted: [...sorted],
    range: heapSize > 0 ? [0, heapSize - 1] : undefined,
    ...extra,
  };
}

function* generateSteps(input: number[]): Generator<VisualizationStep> {
  const values = [...input];
  const ids = values.map((_, i) => i);
  const n = values.length;
  const sorted: number[] = [];

  function swap(a: number, b: number) {
    [values[a], values[b]] = [values[b] as number, values[a] as number];
    [ids[a], ids[b]] = [ids[b] as number, ids[a] as number];
  }

  function* siftDown(i: number, size: number): Generator<VisualizationStep> {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < size) {
      yield {
        description: `Compare parent a[${i}]=${values[i]} with left child a[${l}]=${values[l]}.`,
        state: snapshot(values, ids, sorted, size, { compare: [i, l], pivot: largest }),
        codeLine: lines.compare,
      };
      if ((values[l] as number) > (values[largest] as number)) largest = l;
    }
    if (r < size) {
      yield {
        description: `Compare current largest a[${largest}]=${values[largest]} with right child a[${r}]=${values[r]}.`,
        state: snapshot(values, ids, sorted, size, { compare: [largest, r], pivot: largest }),
        codeLine: lines.compare,
      };
      if ((values[r] as number) > (values[largest] as number)) largest = r;
    }

    if (largest !== i) {
      swap(i, largest);
      yield {
        description: `${values[i]} sifts down — swap with a[${largest}].`,
        state: snapshot(values, ids, sorted, size, { swap: [i, largest] }),
        codeLine: lines.swap,
        metadata: { event: "swap" },
      };
      yield* siftDown(largest, size);
    }
  }

  yield {
    description: `Start with ${n} elements. First build a max-heap, then repeatedly extract the maximum.`,
    state: snapshot(values, ids, sorted, n),
    codeLine: lines.build,
  };

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* siftDown(i, n);
  }

  yield {
    description: "Max-heap built — the largest value is now at the root.",
    state: snapshot(values, ids, sorted, n, { pivot: 0 }),
    metadata: { event: "pass-end" },
  };

  for (let end = n - 1; end > 0; end--) {
    swap(0, end);
    sorted.unshift(end);
    yield {
      description: `Move the root (max) ${values[end]} to the sorted region at the end.`,
      state: snapshot(values, ids, sorted, end, { swap: [0, end] }),
      codeLine: lines.extract,
      metadata: { event: "swap" },
    };
    yield* siftDown(0, end);
  }

  sorted.unshift(0);
  yield {
    description: "Done — every element is in order.",
    state: snapshot(values, ids, Array.from({ length: n }, (_, x) => x), 0),
    codeLine: lines.done,
    metadata: { event: "complete" },
  };
}

export const heapSort: AlgorithmDefinition<number[]> = {
  id: "heap-sort",
  name: "Heap sort",
  category: "sorting",
  difficulty: "advanced",
  timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
  spaceComplexity: "O(1)",
  defaultInput: [7, 3, 9, 4, 6, 2, 8, 5],
  generateSteps,
  codeImplementations: { javascript, python, java },
};
