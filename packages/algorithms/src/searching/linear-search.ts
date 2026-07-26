import type { ArrayState, VisualizationStep } from "@algolens/viz-engine";
import type { AlgorithmDefinition } from "../definition";

export interface SearchInput {
  values: number[];
  target: number;
}

const javascript = `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`;

const python = `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`;

const java = `static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`;

const lines = {
  compare: { javascript: 3, python: 3, java: 3 },
  found: { javascript: 3, python: 4, java: 3 },
  done: { javascript: 5, python: 5, java: 5 },
};

function snapshot(
  values: number[],
  ids: number[],
  extra: Partial<ArrayState> = {},
): ArrayState {
  return { kind: "array", values: [...values], ids: [...ids], ...extra };
}

function* generateSteps(input: SearchInput): Generator<VisualizationStep> {
  const { values, target } = input;
  const ids = values.map((_, i) => i);
  const n = values.length;

  yield {
    description: `Search for ${target} by checking every element from left to right.`,
    state: snapshot(values, ids),
  };

  for (let i = 0; i < n; i++) {
    const match = values[i] === target;
    yield {
      description: `Check a[${i}]=${values[i]}: ${match ? `match!` : `not ${target}, keep going.`}`,
      state: snapshot(values, ids, {
        compare: [i, i],
        pointers: { i },
        sorted: match ? [i] : undefined,
      }),
      codeLine: match ? lines.found : lines.compare,
      metadata: match ? { event: "complete" } : undefined,
    };
    if (match) return;
  }

  yield {
    description: `${target} is not in the array.`,
    state: snapshot(values, ids),
    codeLine: lines.done,
    metadata: { event: "complete" },
  };
}

export const linearSearch: AlgorithmDefinition<SearchInput> = {
  id: "linear-search",
  name: "Linear search",
  category: "searching",
  difficulty: "beginner",
  timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
  spaceComplexity: "O(1)",
  defaultInput: { values: [7, 3, 9, 4, 6, 2, 8, 5], target: 6 },
  generateSteps,
  codeImplementations: { javascript, python, java },
};
