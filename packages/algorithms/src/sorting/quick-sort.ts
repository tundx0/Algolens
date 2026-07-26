import type { ArrayState, VisualizationStep } from "@algolens/viz-engine";
import type { AlgorithmDefinition } from "../definition";

const javascript = `function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return;
  const p = partition(arr, lo, hi);
  quickSort(arr, lo, p - 1);
  quickSort(arr, p + 1, hi);
}

function partition(arr, lo, hi) {
  const pivot = arr[hi];
  let i = lo;
  for (let j = lo; j < hi; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[hi]] = [arr[hi], arr[i]];
  return i;
}`;

const python = `def quick_sort(arr, lo=0, hi=None):
    if hi is None:
        hi = len(arr) - 1
    if lo >= hi:
        return
    p = partition(arr, lo, hi)
    quick_sort(arr, lo, p - 1)
    quick_sort(arr, p + 1, hi)

def partition(arr, lo, hi):
    pivot = arr[hi]
    i = lo
    for j in range(lo, hi):
        if arr[j] < pivot:
            arr[i], arr[j] = arr[j], arr[i]
            i += 1
    arr[i], arr[hi] = arr[hi], arr[i]
    return i`;

const java = `static void quickSort(int[] arr, int lo, int hi) {
    if (lo >= hi) return;
    int p = partition(arr, lo, hi);
    quickSort(arr, lo, p - 1);
    quickSort(arr, p + 1, hi);
}

static int partition(int[] arr, int lo, int hi) {
    int pivot = arr[hi];
    int i = lo;
    for (int j = lo; j < hi; j++) {
        if (arr[j] < pivot) {
            int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
            i++;
        }
    }
    int tmp = arr[i]; arr[i] = arr[hi]; arr[hi] = tmp;
    return i;
}`;

const lines = {
  pivot: { javascript: 9, python: 12, java: 9 },
  compare: { javascript: 11, python: 14, java: 11 },
  swap: { javascript: 12, python: 15, java: 12 },
  place: { javascript: 16, python: 19, java: 17 },
  done: { javascript: 3, python: 5, java: 3 },
};

function snapshot(
  values: number[],
  ids: number[],
  extra: Partial<ArrayState> = {},
): ArrayState {
  return { kind: "array", values: [...values], ids: [...ids], ...extra };
}

function* generateSteps(input: number[]): Generator<VisualizationStep> {
  const values = [...input];
  const ids = values.map((_, i) => i);
  const n = values.length;
  const finalized = new Set<number>();

  function swap(a: number, b: number) {
    [values[a], values[b]] = [values[b] as number, values[a] as number];
    [ids[a], ids[b]] = [ids[b] as number, ids[a] as number];
  }

  function* sort(lo: number, hi: number): Generator<VisualizationStep> {
    if (lo > hi) return;
    if (lo === hi) {
      finalized.add(lo);
      yield {
        description: `Single element [${lo}] is trivially sorted.`,
        state: snapshot(values, ids, { sorted: [...finalized], range: [lo, hi] }),
        metadata: { event: "pass-end" },
      };
      return;
    }

    const pivotValue = values[hi] as number;
    yield {
      description: `Choose a[${hi}]=${pivotValue} as the pivot for [${lo}..${hi}].`,
      state: snapshot(values, ids, {
        sorted: [...finalized],
        pivot: hi,
        range: [lo, hi],
      }),
      codeLine: lines.pivot,
    };

    let i = lo;
    for (let j = lo; j < hi; j++) {
      yield {
        description: `Compare a[${j}]=${values[j]} with pivot ${pivotValue}.`,
        state: snapshot(values, ids, {
          sorted: [...finalized],
          compare: [j, hi],
          pivot: hi,
          pointers: { i, j },
          range: [lo, hi],
        }),
        codeLine: lines.compare,
      };

      if ((values[j] as number) < pivotValue) {
        swap(i, j);
        yield {
          description: `${values[i]} < pivot — swap into the low partition.`,
          state: snapshot(values, ids, {
            sorted: [...finalized],
            swap: [i, j],
            pivot: hi,
            pointers: { i, j },
            range: [lo, hi],
          }),
          codeLine: lines.swap,
          metadata: { event: "swap" },
        };
        i++;
      }
    }

    swap(i, hi);
    finalized.add(i);
    yield {
      description: `Place pivot at its sorted position ${i}.`,
      state: snapshot(values, ids, {
        sorted: [...finalized],
        pivot: i,
        range: [lo, hi],
      }),
      codeLine: lines.place,
      metadata: { event: "pass-end" },
    };

    yield* sort(lo, i - 1);
    yield* sort(i + 1, hi);
  }

  yield {
    description: `Start with ${n} elements. Quick sort partitions around a pivot, then recurses on each side.`,
    state: snapshot(values, ids),
  };

  yield* sort(0, n - 1);

  yield {
    description: "Done — every element is in order.",
    state: snapshot(values, ids, {
      sorted: Array.from({ length: n }, (_, x) => x),
    }),
    codeLine: lines.done,
    metadata: { event: "complete" },
  };
}

export const quickSort: AlgorithmDefinition<number[]> = {
  id: "quick-sort",
  name: "Quick sort",
  category: "sorting",
  difficulty: "intermediate",
  timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" },
  spaceComplexity: "O(log n)",
  defaultInput: [7, 3, 9, 4, 6, 2, 8, 5],
  generateSteps,
  codeImplementations: { javascript, python, java },
};
