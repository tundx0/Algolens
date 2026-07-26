import type { GridCellRole, VisualizationStep } from "@algolens/viz-engine";
import type { AlgorithmDefinition } from "../definition";
import {
  defaultGrid,
  heuristic,
  neighbors,
  reconstructPath,
  snapshot,
  type GridInput,
} from "./grid-utils";

const javascript = `function aStar(grid, start, end) {
  const g = new Map([[start, 0]]);
  const cameFrom = new Map();
  const visited = new Set();
  const open = new Set([start]);
  const f = (n) => g.get(n) + heuristic(n, end);

  while (open.size > 0) {
    const current = [...open].reduce((a, b) => (f(a) < f(b) ? a : b));
    open.delete(current);
    visited.add(current);
    if (current === end) return reconstructPath(cameFrom, end);

    for (const next of neighbors(current, grid)) {
      if (visited.has(next) || grid.isWall(next)) continue;
      const tentative = g.get(current) + 1;
      if (tentative < (g.get(next) ?? Infinity)) {
        g.set(next, tentative);
        cameFrom.set(next, current);
        open.add(next);
      }
    }
  }
  return null;
}`;

const python = `def a_star(grid, start, end):
    g = {start: 0}
    came_from = {}
    visited = set()
    open_set = {start}
    f = lambda n: g[n] + heuristic(n, end)

    while open_set:
        current = min(open_set, key=f)
        open_set.discard(current)
        visited.add(current)
        if current == end:
            return reconstruct_path(came_from, end)

        for nxt in neighbors(current, grid):
            if nxt in visited or grid.is_wall(nxt):
                continue
            tentative = g[current] + 1
            if tentative < g.get(nxt, float("inf")):
                g[nxt] = tentative
                came_from[nxt] = current
                open_set.add(nxt)
    return None`;

const java = `static List<Integer> aStar(Grid grid, int start, int end) {
    Map<Integer, Integer> g = new HashMap<>(Map.of(start, 0));
    Map<Integer, Integer> cameFrom = new HashMap<>();
    Set<Integer> visited = new HashSet<>();
    Comparator<Integer> byF = Comparator.comparingInt(n -> g.get(n) + heuristic(n, end));
    PriorityQueue<Integer> open = new PriorityQueue<>(byF);
    open.add(start);

    while (!open.isEmpty()) {
        int current = open.poll();
        if (visited.contains(current)) continue;
        visited.add(current);
        if (current == end) return reconstructPath(cameFrom, end);

        for (int next : neighbors(current, grid)) {
            if (visited.contains(next) || grid.isWall(next)) continue;
            int tentative = g.get(current) + 1;
            if (tentative < g.getOrDefault(next, Integer.MAX_VALUE)) {
                g.put(next, tentative);
                cameFrom.put(next, current);
                open.add(next);
            }
        }
    }
    return null;
}`;

function* generateSteps(input: GridInput): Generator<VisualizationStep> {
  const { rows, cols, start, end } = input;
  const wallSet = new Set(input.walls);
  const roles = new Map<number, GridCellRole>();
  const g = new Map<number, number>([[start, 0]]);
  const cameFrom = new Map<number, number>();
  const visited = new Set<number>();
  const open = new Set<number>([start]);
  const f = (n: number) => (g.get(n) as number) + heuristic(n, end, cols);

  yield {
    description:
      "A* is Dijkstra plus a heuristic — the Manhattan distance to the goal — so it prioritizes cells that look promising. The frontier stretches toward the target instead of spreading evenly.",
    state: snapshot(input, roles),
  };

  while (open.size > 0) {
    let current = -1;
    let best = Infinity;
    for (const n of open) {
      const score = f(n);
      if (score < best) {
        best = score;
        current = n;
      }
    }
    open.delete(current);
    visited.add(current);
    roles.set(current, "visited");

    if (current === end) {
      yield {
        description: "Reached the target.",
        state: snapshot(input, roles, current),
        metadata: { event: "pass-end" },
      };
      const path = reconstructPath(cameFrom, end, start);
      for (const p of path) roles.set(p, "path");
      yield {
        description: `Shortest path found — cost ${g.get(end)}.`,
        state: snapshot(input, roles),
        metadata: { event: "complete" },
      };
      return;
    }

    yield {
      description: `Expand cell ${current} — the frontier's most promising cell (distance so far + estimate to goal).`,
      state: snapshot(input, roles, current),
      metadata: { event: "pass-end" },
    };

    for (const next of neighbors(current, rows, cols)) {
      if (visited.has(next) || wallSet.has(next)) continue;
      const tentative = (g.get(current) as number) + 1;
      if (tentative < (g.get(next) ?? Infinity)) {
        g.set(next, tentative);
        cameFrom.set(next, current);
        open.add(next);
        roles.set(next, "frontier");
        yield {
          description: `Discover cell ${next}.`,
          state: snapshot(input, roles, current),
        };
      }
    }
  }

  yield {
    description: "No path exists between start and end.",
    state: snapshot(input, roles),
    metadata: { event: "complete" },
  };
}

export const aStar: AlgorithmDefinition<GridInput> = {
  id: "a-star",
  name: "A* search",
  category: "graph",
  difficulty: "advanced",
  timeComplexity: { best: "O(E)", average: "O(E log V)", worst: "O(E log V)" },
  spaceComplexity: "O(V)",
  defaultInput: defaultGrid(),
  generateSteps,
  codeImplementations: { javascript, python, java },
};
