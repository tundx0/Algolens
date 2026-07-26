import type { ExerciseDefinition } from "../types";

export const graphs: ExerciseDefinition[] = [
  {
    id: "number-of-islands",
    title: "Number of Islands",
    category: "graphs",
    difficulty: "medium",
    prompt: `You're given a 2D grid of \`1\`s (land) and \`0\`s (water). An island is a group of \`1\`s connected horizontally or vertically. Return the number of islands.

This is exactly the grid-traversal idea behind [BFS](/visualize?algo=bfs) and [DFS](/visualize?algo=dfs) — instead of finding a path, you're flood-filling each connected region.

**Example**
\`\`\`
Input: grid = [
  [1, 1, 0, 0],
  [1, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
]
Output: 3
\`\`\``,
    functionName: "numIslands",
    relatedAlgorithmId: "bfs",
    starterCode: `/**
 * @param {number[][]} grid
 * @return {number}
 */
function numIslands(grid) {
  // your code here
}`,
    solutionCode: `function numIslands(grid) {
  const rows = grid.length, cols = grid[0]?.length ?? 0;
  const seen = Array.from({ length: rows }, () => new Array(cols).fill(false));

  function flood(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (seen[r][c] || grid[r][c] === 0) return;
    seen[r][c] = true;
    flood(r + 1, c); flood(r - 1, c); flood(r, c + 1); flood(r, c - 1);
  }

  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1 && !seen[r][c]) {
        count++;
        flood(r, c);
      }
    }
  }
  return count;
}`,
    testCases: [
      {
        args: [
          [
            [1, 1, 0, 0],
            [1, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
          ],
        ],
        expected: 3,
      },
      { args: [[[0, 0], [0, 0]]], expected: 0 },
      { args: [[[1, 1, 1]]], expected: 1 },
    ],
    languages: {
      python: {
        functionName: "num_islands",
        starterCode: `def num_islands(grid: list[list[int]]) -> int:
    # your code here
    pass`,
        solutionCode: `def num_islands(grid: list[list[int]]) -> int:
    rows = len(grid)
    cols = len(grid[0]) if rows else 0
    seen = [[False] * cols for _ in range(rows)]

    def flood(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        if seen[r][c] or grid[r][c] == 0:
            return
        seen[r][c] = True
        flood(r + 1, c)
        flood(r - 1, c)
        flood(r, c + 1)
        flood(r, c - 1)

    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1 and not seen[r][c]:
                count += 1
                flood(r, c)
    return count`,
      },
    },
  },
  {
    id: "course-schedule",
    title: "Course Schedule",
    category: "graphs",
    difficulty: "medium",
    prompt: `There are \`numCourses\` courses labeled \`0\` to \`numCourses - 1\`. \`prerequisites[i] = [a, b]\` means you must take course \`b\` before course \`a\`. Return \`true\` if you can finish every course, i.e. the prerequisites don't form a cycle.

**Example**
\`\`\`
Input: numCourses = 2, prerequisites = [[1, 0]]
Output: true         // take 0, then 1

Input: numCourses = 2, prerequisites = [[1, 0], [0, 1]]
Output: false        // 0 needs 1 and 1 needs 0
\`\`\``,
    functionName: "canFinish",
    starterCode: `/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
function canFinish(numCourses, prerequisites) {
  // your code here
}`,
    solutionCode: `function canFinish(numCourses, prerequisites) {
  const graph = Array.from({ length: numCourses }, () => []);
  for (const [a, b] of prerequisites) graph[a].push(b);

  const UNVISITED = 0, VISITING = 1, DONE = 2;
  const state = new Array(numCourses).fill(UNVISITED);

  function hasCycle(node) {
    if (state[node] === VISITING) return true;
    if (state[node] === DONE) return false;
    state[node] = VISITING;
    for (const next of graph[node]) {
      if (hasCycle(next)) return true;
    }
    state[node] = DONE;
    return false;
  }

  for (let course = 0; course < numCourses; course++) {
    if (hasCycle(course)) return false;
  }
  return true;
}`,
    testCases: [
      { args: [2, [[1, 0]]], expected: true },
      { args: [2, [[1, 0], [0, 1]]], expected: false },
      { args: [1, []], expected: true },
      { args: [4, [[1, 0], [2, 0], [3, 1], [3, 2]]], expected: true },
    ],
    languages: {
      python: {
        functionName: "can_finish",
        starterCode: `def can_finish(num_courses: int, prerequisites: list[list[int]]) -> bool:
    # your code here
    pass`,
        solutionCode: `def can_finish(num_courses: int, prerequisites: list[list[int]]) -> bool:
    graph = [[] for _ in range(num_courses)]
    for a, b in prerequisites:
        graph[a].append(b)

    UNVISITED, VISITING, DONE = 0, 1, 2
    state = [UNVISITED] * num_courses

    def has_cycle(node):
        if state[node] == VISITING:
            return True
        if state[node] == DONE:
            return False
        state[node] = VISITING
        for nxt in graph[node]:
            if has_cycle(nxt):
                return True
        state[node] = DONE
        return False

    return not any(has_cycle(course) for course in range(num_courses))`,
      },
    },
  },
];
