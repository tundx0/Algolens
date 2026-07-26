import type { GridCellRole, VisualizationStep } from "@algolens/viz-engine";
import type { AlgorithmDefinition } from "../definition";
import {
  defaultGrid,
  neighbors,
  reconstructPath,
  snapshot,
  type GridInput,
} from "./grid-utils";

const javascript = `function bfs(grid, start, end) {
  const queue = [start];
  const visited = new Set([start]);
  const cameFrom = new Map();

  while (queue.length > 0) {
    const current = queue.shift();
    if (current === end) return reconstructPath(cameFrom, end);

    for (const next of neighbors(current, grid)) {
      if (visited.has(next) || grid.isWall(next)) continue;
      visited.add(next);
      cameFrom.set(next, current);
      queue.push(next);
    }
  }
  return null; // no path
}`;

const python = `def bfs(grid, start, end):
    queue = deque([start])
    visited = {start}
    came_from = {}

    while queue:
        current = queue.popleft()
        if current == end:
            return reconstruct_path(came_from, end)

        for nxt in neighbors(current, grid):
            if nxt in visited or grid.is_wall(nxt):
                continue
            visited.add(nxt)
            came_from[nxt] = current
            queue.append(nxt)
    return None`;

const java = `static List<Integer> bfs(Grid grid, int start, int end) {
    Queue<Integer> queue = new ArrayDeque<>(List.of(start));
    Set<Integer> visited = new HashSet<>(Set.of(start));
    Map<Integer, Integer> cameFrom = new HashMap<>();

    while (!queue.isEmpty()) {
        int current = queue.poll();
        if (current == end) return reconstructPath(cameFrom, end);

        for (int next : neighbors(current, grid)) {
            if (visited.contains(next) || grid.isWall(next)) continue;
            visited.add(next);
            cameFrom.put(next, current);
            queue.add(next);
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
  const queue: number[] = [start];

  yield {
    description:
      "Breadth-first search explores layer by layer — every cell one step away is visited before any cell two steps away, guaranteeing the shortest path in an unweighted grid.",
    state: snapshot(input, roles),
  };

  while (queue.length > 0) {
    const current = queue.shift() as number;
    roles.set(current, "visited");

    if (current === end) {
      yield {
        description: "Reached the target — reconstructing the shortest path.",
        state: snapshot(input, roles, current),
        metadata: { event: "pass-end" },
      };
      const path = reconstructPath(cameFrom, end, start);
      for (const p of path) roles.set(p, "path");
      yield {
        description: `Path found — ${path.length - 1} steps from start to end.`,
        state: snapshot(input, roles),
        metadata: { event: "complete" },
      };
      return;
    }

    yield {
      description: `Dequeue cell ${current} and check its neighbors.`,
      state: snapshot(input, roles, current),
      metadata: { event: "pass-end" },
    };

    for (const next of neighbors(current, rows, cols)) {
      if (visited.has(next) || wallSet.has(next)) continue;
      visited.add(next);
      cameFrom.set(next, current);
      queue.push(next);
      roles.set(next, "frontier");
      yield {
        description: `Discover cell ${next} — add it to the frontier.`,
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

export const bfs: AlgorithmDefinition<GridInput> = {
  id: "bfs",
  name: "Breadth-first search",
  category: "graph",
  difficulty: "intermediate",
  timeComplexity: { best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)" },
  spaceComplexity: "O(V)",
  defaultInput: defaultGrid(),
  generateSteps,
  codeImplementations: { javascript, python, java },
};
