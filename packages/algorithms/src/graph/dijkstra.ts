import type { GridCellRole, VisualizationStep } from "@algolens/viz-engine";
import type { AlgorithmDefinition } from "../definition";
import {
  defaultGrid,
  neighbors,
  reconstructPath,
  snapshot,
  type GridInput,
} from "./grid-utils";

const javascript = `function dijkstra(grid, start, end) {
  const dist = new Map([[start, 0]]);
  const cameFrom = new Map();
  const visited = new Set();
  const open = new Set([start]);

  while (open.size > 0) {
    const current = [...open].reduce((a, b) => (dist.get(a) < dist.get(b) ? a : b));
    open.delete(current);
    visited.add(current);
    if (current === end) return reconstructPath(cameFrom, end);

    for (const next of neighbors(current, grid)) {
      if (visited.has(next) || grid.isWall(next)) continue;
      const newDist = dist.get(current) + 1;
      if (newDist < (dist.get(next) ?? Infinity)) {
        dist.set(next, newDist);
        cameFrom.set(next, current);
        open.add(next);
      }
    }
  }
  return null;
}`;

const python = `def dijkstra(grid, start, end):
    dist = {start: 0}
    came_from = {}
    visited = set()
    open_set = {start}

    while open_set:
        current = min(open_set, key=lambda n: dist[n])
        open_set.discard(current)
        visited.add(current)
        if current == end:
            return reconstruct_path(came_from, end)

        for nxt in neighbors(current, grid):
            if nxt in visited or grid.is_wall(nxt):
                continue
            new_dist = dist[current] + 1
            if new_dist < dist.get(nxt, float("inf")):
                dist[nxt] = new_dist
                came_from[nxt] = current
                open_set.add(nxt)
    return None`;

const java = `static List<Integer> dijkstra(Grid grid, int start, int end) {
    Map<Integer, Integer> dist = new HashMap<>(Map.of(start, 0));
    Map<Integer, Integer> cameFrom = new HashMap<>();
    Set<Integer> visited = new HashSet<>();
    PriorityQueue<Integer> open = new PriorityQueue<>(Comparator.comparingInt(dist::get));
    open.add(start);

    while (!open.isEmpty()) {
        int current = open.poll();
        if (visited.contains(current)) continue;
        visited.add(current);
        if (current == end) return reconstructPath(cameFrom, end);

        for (int next : neighbors(current, grid)) {
            if (visited.contains(next) || grid.isWall(next)) continue;
            int newDist = dist.get(current) + 1;
            if (newDist < dist.getOrDefault(next, Integer.MAX_VALUE)) {
                dist.put(next, newDist);
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
  const dist = new Map<number, number>([[start, 0]]);
  const cameFrom = new Map<number, number>();
  const visited = new Set<number>();
  const open = new Set<number>([start]);

  yield {
    description:
      "Dijkstra always expands the unvisited cell with the smallest known distance from the start. With uniform edge weights on a grid, that order matches BFS — the priority queue only pays off once cells have different costs.",
    state: snapshot(input, roles),
  };

  while (open.size > 0) {
    let current = -1;
    let best = Infinity;
    for (const n of open) {
      const d = dist.get(n) as number;
      if (d < best) {
        best = d;
        current = n;
      }
    }
    open.delete(current);
    visited.add(current);
    roles.set(current, "visited");

    if (current === end) {
      yield {
        description: `Reached the target with distance ${dist.get(current)}.`,
        state: snapshot(input, roles, current),
        metadata: { event: "pass-end" },
      };
      const path = reconstructPath(cameFrom, end, start);
      for (const p of path) roles.set(p, "path");
      yield {
        description: `Shortest path found — cost ${dist.get(end)}.`,
        state: snapshot(input, roles),
        metadata: { event: "complete" },
      };
      return;
    }

    yield {
      description: `Finalize cell ${current} at distance ${dist.get(current)} — it can't be reached any cheaper.`,
      state: snapshot(input, roles, current),
      metadata: { event: "pass-end" },
    };

    for (const next of neighbors(current, rows, cols)) {
      if (visited.has(next) || wallSet.has(next)) continue;
      const newDist = (dist.get(current) as number) + 1;
      if (newDist < (dist.get(next) ?? Infinity)) {
        dist.set(next, newDist);
        cameFrom.set(next, current);
        open.add(next);
        roles.set(next, "frontier");
        yield {
          description: `Relax cell ${next} — new best distance ${newDist}.`,
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

export const dijkstra: AlgorithmDefinition<GridInput> = {
  id: "dijkstra",
  name: "Dijkstra's algorithm",
  category: "graph",
  difficulty: "advanced",
  timeComplexity: { best: "O(E log V)", average: "O(E log V)", worst: "O(E log V)" },
  spaceComplexity: "O(V)",
  defaultInput: defaultGrid(),
  generateSteps,
  codeImplementations: { javascript, python, java },
};
