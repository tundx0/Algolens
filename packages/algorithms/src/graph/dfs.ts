import type { GridCellRole, VisualizationStep } from "@algolens/viz-engine";
import type { AlgorithmDefinition } from "../definition";
import {
  defaultGrid,
  neighbors,
  reconstructPath,
  snapshot,
  type GridInput,
} from "./grid-utils";

const javascript = `function dfs(grid, start, end) {
  const stack = [start];
  const visited = new Set([start]);
  const cameFrom = new Map();

  while (stack.length > 0) {
    const current = stack.pop();
    if (current === end) return reconstructPath(cameFrom, end);

    for (const next of neighbors(current, grid)) {
      if (visited.has(next) || grid.isWall(next)) continue;
      visited.add(next);
      cameFrom.set(next, current);
      stack.push(next);
    }
  }
  return null;
}`;

const python = `def dfs(grid, start, end):
    stack = [start]
    visited = {start}
    came_from = {}

    while stack:
        current = stack.pop()
        if current == end:
            return reconstruct_path(came_from, end)

        for nxt in neighbors(current, grid):
            if nxt in visited or grid.is_wall(nxt):
                continue
            visited.add(nxt)
            came_from[nxt] = current
            stack.append(nxt)
    return None`;

const java = `static List<Integer> dfs(Grid grid, int start, int end) {
    Deque<Integer> stack = new ArrayDeque<>(List.of(start));
    Set<Integer> visited = new HashSet<>(Set.of(start));
    Map<Integer, Integer> cameFrom = new HashMap<>();

    while (!stack.isEmpty()) {
        int current = stack.pop();
        if (current == end) return reconstructPath(cameFrom, end);

        for (int next : neighbors(current, grid)) {
            if (visited.contains(next) || grid.isWall(next)) continue;
            visited.add(next);
            cameFrom.put(next, current);
            stack.push(next);
        }
    }
    return null;
}`;

function* generateSteps(input: GridInput): Generator<VisualizationStep> {
  const { rows, cols, start, end } = input;
  const wallSet = new Set(input.walls);
  const roles = new Map<number, GridCellRole>();
  const cameFrom = new Map<number, number>();
  const visited = new Set<number>([start]);
  const stack: number[] = [start];

  yield {
    description:
      "Depth-first search commits to one direction and follows it as far as possible before backtracking — the frontier grows as a single probing line, not a ripple.",
    state: snapshot(input, roles),
  };

  while (stack.length > 0) {
    const current = stack.pop() as number;
    roles.set(current, "visited");

    if (current === end) {
      yield {
        description: "Reached the target — reconstructing the path.",
        state: snapshot(input, roles, current),
        metadata: { event: "pass-end" },
      };
      const path = reconstructPath(cameFrom, end, start);
      for (const p of path) roles.set(p, "path");
      yield {
        description: `Path found — ${path.length - 1} steps (not guaranteed shortest).`,
        state: snapshot(input, roles),
        metadata: { event: "complete" },
      };
      return;
    }

    yield {
      description: `Visit cell ${current} and push its unvisited neighbors.`,
      state: snapshot(input, roles, current),
      metadata: { event: "pass-end" },
    };

    for (const next of neighbors(current, rows, cols)) {
      if (visited.has(next) || wallSet.has(next)) continue;
      visited.add(next);
      cameFrom.set(next, current);
      stack.push(next);
      roles.set(next, "frontier");
      yield {
        description: `Discover cell ${next} — push it onto the stack.`,
        state: snapshot(input, roles, current),
      };
    }
  }

  yield {
    description: "No path exists between start and end.",
    state: snapshot(input, roles),
    metadata: { event: "complete" },
  };
}

export const dfs: AlgorithmDefinition<GridInput> = {
  id: "dfs",
  name: "Depth-first search",
  category: "graph",
  difficulty: "intermediate",
  timeComplexity: { best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)" },
  spaceComplexity: "O(V)",
  defaultInput: defaultGrid(),
  generateSteps,
  codeImplementations: { javascript, python, java },
};
