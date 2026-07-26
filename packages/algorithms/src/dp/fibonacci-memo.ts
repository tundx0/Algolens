import type { TableCellRole, TableState, VisualizationStep } from "@algolens/viz-engine";
import type { AlgorithmDefinition } from "../definition";

const javascript = `function fib(n, memo = new Map()) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);
  const result = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, result);
  return result;
}`;

const python = `def fib(n, memo=None):
    if memo is None:
        memo = {}
    if n <= 1:
        return n
    if n in memo:
        return memo[n]
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]`;

const java = `static long fib(int n, Map<Integer, Long> memo) {
    if (n <= 1) return n;
    if (memo.containsKey(n)) return memo.get(n);
    long result = fib(n - 1, memo) + fib(n - 2, memo);
    memo.put(n, result);
    return result;
}`;

function snapshot(
  cells: (number | null)[],
  roles: Record<number, TableCellRole>,
): TableState {
  return {
    kind: "table",
    rows: 1,
    cols: cells.length,
    cells: [...cells],
    roles,
    colLabels: cells.map((_, i) => String(i)),
  };
}

function* generateSteps(n: number): Generator<VisualizationStep> {
  const cells: (number | null)[] = new Array(n + 1).fill(null);

  yield {
    description: `Compute fib(${n}) with memoization — each value is calculated once and reused instead of recomputed.`,
    state: snapshot(cells, {}),
  };

  function* fib(k: number): Generator<VisualizationStep, number> {
    if (k <= 1) {
      cells[k] = k;
      yield {
        description: `Base case: fib(${k}) = ${k}.`,
        state: snapshot(cells, { [k]: "filled" }),
        codeLine: { javascript: 2, python: 4, java: 2 },
      };
      return k;
    }

    if (cells[k] !== null) {
      yield {
        description: `fib(${k}) is already cached — reuse it, no recomputation.`,
        state: snapshot(cells, { [k]: "dependency" }),
        codeLine: { javascript: 3, python: 6, java: 3 },
      };
      return cells[k] as number;
    }

    yield {
      description: `Compute fib(${k}) = fib(${k - 1}) + fib(${k - 2}).`,
      state: snapshot(cells, { [k]: "computing" }),
      codeLine: { javascript: 4, python: 8, java: 4 },
    };

    const a = yield* fib(k - 1);
    const b = yield* fib(k - 2);
    const result = a + b;
    cells[k] = result;

    yield {
      description: `fib(${k}) = ${a} + ${b} = ${result}.`,
      state: snapshot(cells, { [k]: "filled", [k - 1]: "dependency", [k - 2]: "dependency" }),
      codeLine: { javascript: 5, python: 8, java: 4 },
      metadata: { event: "swap" },
    };

    return result;
  }

  const result = yield* fib(n);

  yield {
    description: `Done — fib(${n}) = ${result}.`,
    state: snapshot(cells, { [n]: "answer" }),
    metadata: { event: "complete" },
  };
}

export const fibonacciMemo: AlgorithmDefinition<number> = {
  id: "fibonacci-memo",
  name: "Fibonacci (memoization)",
  category: "dp",
  difficulty: "beginner",
  timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
  spaceComplexity: "O(n)",
  defaultInput: 10,
  generateSteps,
  codeImplementations: { javascript, python, java },
};
