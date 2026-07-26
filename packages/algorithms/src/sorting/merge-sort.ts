import type { ArrayState, VisualizationStep } from "@algolens/viz-engine";
import type { AlgorithmDefinition } from "../definition";

const javascript = `function mergeSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return;
  const mid = Math.floor((lo + hi) / 2);
  mergeSort(arr, lo, mid);
  mergeSort(arr, mid + 1, hi);
  merge(arr, lo, mid, hi);
}

function merge(arr, lo, mid, hi) {
  const left = arr.slice(lo, mid + 1);
  const right = arr.slice(mid + 1, hi + 1);
  let i = 0, j = 0, k = lo;
  while (i < left.length && j < right.length) {
    arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];
  }
  while (i < left.length) arr[k++] = left[i++];
  while (j < right.length) arr[k++] = right[j++];
}`;

const python = `def merge_sort(arr, lo=0, hi=None):
    if hi is None:
        hi = len(arr) - 1
    if lo >= hi:
        return
    mid = (lo + hi) // 2
    merge_sort(arr, lo, mid)
    merge_sort(arr, mid + 1, hi)
    merge(arr, lo, mid, hi)

def merge(arr, lo, mid, hi):
    left = arr[lo:mid + 1]
    right = arr[mid + 1:hi + 1]
    i = j = 0
    k = lo
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            arr[k] = left[i]; i += 1
        else:
            arr[k] = right[j]; j += 1
        k += 1
    while i < len(left):
        arr[k] = left[i]; i += 1; k += 1
    while j < len(right):
        arr[k] = right[j]; j += 1; k += 1`;

const java = `static void mergeSort(int[] arr, int lo, int hi) {
    if (lo >= hi) return;
    int mid = (lo + hi) / 2;
    mergeSort(arr, lo, mid);
    mergeSort(arr, mid + 1, hi);
    merge(arr, lo, mid, hi);
}

static void merge(int[] arr, int lo, int mid, int hi) {
    int[] left = Arrays.copyOfRange(arr, lo, mid + 1);
    int[] right = Arrays.copyOfRange(arr, mid + 1, hi + 1);
    int i = 0, j = 0, k = lo;
    while (i < left.length && j < right.length) {
        arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    }
    while (i < left.length) arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];
}`;

const lines = {
  split: { javascript: 4, python: 8, java: 3 },
  compare: { javascript: 14, python: 20, java: 13 },
  write: { javascript: 14, python: 21, java: 13 },
  done: { javascript: 6, python: 9, java: 6 },
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

  function* sort(lo: number, hi: number): Generator<VisualizationStep> {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);

    yield {
      description: `Split [${lo}..${hi}] into [${lo}..${mid}] and [${mid + 1}..${hi}].`,
      state: snapshot(values, ids, { range: [lo, hi], pointers: { mid } }),
      codeLine: lines.split,
      metadata: { event: "recurse", frame: { lo, hi } },
    };

    yield* sort(lo, mid);
    yield* sort(mid + 1, hi);

    const left = values.slice(lo, mid + 1);
    const leftIds = ids.slice(lo, mid + 1);
    const right = values.slice(mid + 1, hi + 1);
    const rightIds = ids.slice(mid + 1, hi + 1);
    let i = 0;
    let j = 0;
    let k = lo;

    while (i < left.length && j < right.length) {
      const takeLeft = (left[i] as number) <= (right[j] as number);
      yield {
        description: `Merge: compare left ${left[i]} with right ${right[j]} — take ${takeLeft ? "left" : "right"}.`,
        state: snapshot(values, ids, {
          range: [lo, hi],
          compare: [lo + i, mid + 1 + j],
          pointers: { k },
        }),
        codeLine: lines.compare,
      };

      if (takeLeft) {
        values[k] = left[i] as number;
        ids[k] = leftIds[i] as number;
        i++;
      } else {
        values[k] = right[j] as number;
        ids[k] = rightIds[j] as number;
        j++;
      }

      yield {
        description: `Write ${values[k]} into position ${k}.`,
        state: snapshot(values, ids, { range: [lo, hi], pivot: k }),
        codeLine: lines.write,
        metadata: { event: "swap" },
      };
      k++;
    }

    while (i < left.length) {
      values[k] = left[i] as number;
      ids[k] = leftIds[i] as number;
      yield {
        description: `Write remaining left value ${values[k]} into position ${k}.`,
        state: snapshot(values, ids, { range: [lo, hi], pivot: k }),
        codeLine: lines.write,
        metadata: { event: "swap" },
      };
      i++;
      k++;
    }
    while (j < right.length) {
      values[k] = right[j] as number;
      ids[k] = rightIds[j] as number;
      yield {
        description: `Write remaining right value ${values[k]} into position ${k}.`,
        state: snapshot(values, ids, { range: [lo, hi], pivot: k }),
        codeLine: lines.write,
        metadata: { event: "swap" },
      };
      j++;
      k++;
    }

    yield {
      description: `[${lo}..${hi}] is merged and sorted.`,
      state: snapshot(values, ids, {
        sorted: lo === 0 && hi === n - 1 ? Array.from({ length: n }, (_, x) => x) : undefined,
        range: [lo, hi],
      }),
      codeLine: lines.done,
      metadata: { event: "pass-end", frame: { lo, hi, popped: true } },
    };
  }

  yield {
    description: `Start with ${n} elements. Merge sort splits recursively, then merges sorted halves back together.`,
    state: snapshot(values, ids),
  };

  yield* sort(0, n - 1);

  yield {
    description: "Done — every element is in order.",
    state: snapshot(
      values,
      ids,
      { sorted: Array.from({ length: n }, (_, x) => x) },
    ),
    codeLine: lines.done,
    metadata: { event: "complete" },
  };
}

export const mergeSort: AlgorithmDefinition<number[]> = {
  id: "merge-sort",
  name: "Merge sort",
  category: "sorting",
  difficulty: "intermediate",
  timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
  spaceComplexity: "O(n)",
  defaultInput: [7, 3, 9, 4, 6, 2, 8, 5],
  generateSteps,
  codeImplementations: { javascript, python, java },
};
