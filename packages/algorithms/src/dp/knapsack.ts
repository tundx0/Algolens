import type { TableCellRole, TableState, VisualizationStep } from "@algolens/viz-engine";
import type { AlgorithmDefinition } from "../definition";

export interface KnapsackInput {
  weights: number[];
  values: number[];
  capacity: number;
}

const javascript = `function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] > w) {
        dp[i][w] = dp[i - 1][w];
      } else {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
        );
      }
    }
  }
  return dp[n][capacity];
}`;

const python = `def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(capacity + 1):
            if weights[i - 1] > w:
                dp[i][w] = dp[i - 1][w]
            else:
                dp[i][w] = max(
                    dp[i - 1][w],
                    values[i - 1] + dp[i - 1][w - weights[i - 1]],
                )
    return dp[n][capacity]`;

const java = `static int knapsack(int[] weights, int[] values, int capacity) {
    int n = weights.length;
    int[][] dp = new int[n + 1][capacity + 1];

    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            if (weights[i - 1] > w) {
                dp[i][w] = dp[i - 1][w];
            } else {
                dp[i][w] = Math.max(
                    dp[i - 1][w],
                    values[i - 1] + dp[i - 1][w - weights[i - 1]]
                );
            }
        }
    }
    return dp[n][capacity];
}`;

function* generateSteps(input: KnapsackInput): Generator<VisualizationStep> {
  const { weights, values, capacity } = input;
  const n = weights.length;
  const cols = capacity + 1;
  const cells: (number | null)[] = new Array((n + 1) * cols).fill(null);
  const idx = (i: number, w: number) => i * cols + w;

  const snapshot = (roles: Record<number, TableCellRole>): TableState => ({
    kind: "table",
    rows: n + 1,
    cols,
    cells: [...cells],
    roles,
    colLabels: Array.from({ length: cols }, (_, w) => String(w)),
    rowLabels: Array.from({ length: n + 1 }, (_, i) => (i === 0 ? "∅" : `item ${i}`)),
  });

  for (let w = 0; w < cols; w++) cells[idx(0, w)] = 0;
  yield {
    description: `Build a table where dp[i][w] = the best value using the first i items within capacity w. Row 0 (no items) is all zero.`,
    state: snapshot({}),
  };

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w < cols; w++) {
      const skip = idx(i - 1, w);
      const weight = weights[i - 1] as number;
      const value = values[i - 1] as number;

      if (weight > w) {
        cells[idx(i, w)] = cells[skip] ?? null;
        yield {
          description: `Item ${i} (weight ${weight}) doesn't fit in capacity ${w} — carry over dp[${i - 1}][${w}] = ${cells[skip]}.`,
          state: snapshot({ [idx(i, w)]: "computing", [skip]: "dependency" }),
          codeLine: { javascript: 8, python: 8, java: 8 },
        };
      } else {
        const take = idx(i - 1, w - weight);
        const takeValue = value + (cells[take] as number);
        const skipValue = cells[skip] as number;
        const best = Math.max(skipValue, takeValue);
        cells[idx(i, w)] = best;
        yield {
          description: `Item ${i} (w=${weight}, v=${value}): skip → ${skipValue}, take → ${value} + dp[${i - 1}][${w - weight}] = ${takeValue}. Take the better one: ${best}.`,
          state: snapshot({
            [idx(i, w)]: "computing",
            [skip]: "dependency",
            [take]: "dependency",
          }),
          codeLine: { javascript: 11, python: 11, java: 11 },
        };
      }

      yield {
        description: `dp[${i}][${w}] = ${cells[idx(i, w)]}.`,
        state: snapshot({ [idx(i, w)]: "filled" }),
        metadata: { event: "swap" },
      };
    }
  }

  yield {
    description: `Done — the best value within capacity ${capacity} using all ${n} items is ${cells[idx(n, capacity)]}.`,
    state: snapshot({ [idx(n, capacity)]: "answer" }),
    metadata: { event: "complete" },
  };
}

export const knapsack: AlgorithmDefinition<KnapsackInput> = {
  id: "knapsack",
  name: "0/1 Knapsack",
  category: "dp",
  difficulty: "advanced",
  timeComplexity: { best: "O(n·W)", average: "O(n·W)", worst: "O(n·W)" },
  spaceComplexity: "O(n·W)",
  defaultInput: {
    weights: [2, 3, 4, 5],
    values: [3, 4, 5, 6],
    capacity: 8,
  },
  generateSteps,
  codeImplementations: { javascript, python, java },
};
