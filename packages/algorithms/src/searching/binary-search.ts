import type { ArrayState, VisualizationStep } from "@algolens/viz-engine";
import type { AlgorithmDefinition } from "../definition";
import type { SearchInput } from "./linear-search";

const javascript = `function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`;

const python = `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`;

const java = `static int binarySearch(int[] arr, int target) {
    int lo = 0, hi = arr.length - 1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`;

const lines = {
  mid: { javascript: 4, python: 4, java: 4 },
  found: { javascript: 5, python: 6, java: 5 },
  goRight: { javascript: 6, python: 7, java: 6 },
  goLeft: { javascript: 7, python: 9, java: 7 },
  done: { javascript: 9, python: 11, java: 9 },
};

function snapshot(
  values: number[],
  ids: number[],
  extra: Partial<ArrayState> = {},
): ArrayState {
  return { kind: "array", values: [...values], ids: [...ids], ...extra };
}

function* generateSteps(input: SearchInput): Generator<VisualizationStep> {
  const values = [...input.values].sort((a, b) => a - b);
  const target = input.target;
  const ids = values.map((_, i) => i);
  let lo = 0;
  let hi = values.length - 1;

  yield {
    description: `Array is sorted. Search for ${target} by repeatedly halving the search space [${lo}..${hi}].`,
    state: snapshot(values, ids, { range: [lo, hi] }),
  };

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const midValue = values[mid] as number;

    yield {
      description: `Check midpoint a[${mid}]=${midValue}.`,
      state: snapshot(values, ids, {
        pivot: mid,
        pointers: { lo, mid, hi },
        range: [lo, hi],
      }),
      codeLine: lines.mid,
    };

    if (midValue === target) {
      yield {
        description: `${midValue} = ${target} — found at index ${mid}.`,
        state: snapshot(values, ids, { sorted: [mid], pointers: { mid } }),
        codeLine: lines.found,
        metadata: { event: "complete" },
      };
      return;
    }

    if (midValue < target) {
      yield {
        description: `${midValue} < ${target} — discard the left half, search [${mid + 1}..${hi}].`,
        state: snapshot(values, ids, {
          compare: [mid, mid],
          pointers: { lo, mid, hi },
          range: [mid + 1, hi],
        }),
        codeLine: lines.goRight,
      };
      lo = mid + 1;
    } else {
      yield {
        description: `${midValue} > ${target} — discard the right half, search [${lo}..${mid - 1}].`,
        state: snapshot(values, ids, {
          compare: [mid, mid],
          pointers: { lo, mid, hi },
          range: [lo, mid - 1],
        }),
        codeLine: lines.goLeft,
      };
      hi = mid - 1;
    }
  }

  yield {
    description: `${target} is not in the array.`,
    state: snapshot(values, ids),
    codeLine: lines.done,
    metadata: { event: "complete" },
  };
}

export const binarySearch: AlgorithmDefinition<SearchInput> = {
  id: "binary-search",
  name: "Binary search",
  category: "searching",
  difficulty: "beginner",
  timeComplexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
  spaceComplexity: "O(1)",
  defaultInput: { values: [7, 3, 9, 4, 6, 2, 8, 5], target: 6 },
  generateSteps,
  codeImplementations: { javascript, python, java },
};
