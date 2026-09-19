import type { ExerciseDefinition } from "../types";

export const heap: ExerciseDefinition[] = [
  {
    id: "kth-largest-element",
    title: "Kth Largest Element in an Array",
    category: "heap",
    difficulty: "medium",
    prompt: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\`th largest element — the \`k\`th largest in sorted order, not the \`k\`th distinct value.

This is the same "always grab the biggest remaining" idea behind [Heap sort](/visualize?algo=heap-sort), just stopping after \`k\` extractions instead of sorting everything.

**Example**
\`\`\`
Input: nums = [3, 2, 1, 5, 6, 4], k = 2
Output: 5
\`\`\``,
    functionName: "findKthLargest",
    relatedAlgorithmId: "heap-sort",
    starterCode: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
function findKthLargest(nums, k) {
  // your code here
}`,
    solutionCode: `function findKthLargest(nums, k) {
  const sorted = [...nums].sort((a, b) => b - a);
  return sorted[k - 1];
}`,
    testCases: [
      { args: [[3, 2, 1, 5, 6, 4], 2], expected: 5 },
      { args: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4 },
      { args: [[1], 1], expected: 1 },
    ],
    languages: {
      python: {
        functionName: "find_kth_largest",
        starterCode: `def find_kth_largest(nums: list[int], k: int) -> int:
    # your code here
    pass`,
        solutionCode: `import heapq

def find_kth_largest(nums: list[int], k: int) -> int:
    return heapq.nlargest(k, nums)[-1]`,
      },
    },
  },
  {
    id: "last-stone-weight",
    title: "Last Stone Weight",
    category: "heap",
    difficulty: "easy",
    prompt: `You have stones with weights given by \`stones\`. Each turn, take the two heaviest stones and smash them together: if they're equal, both are destroyed; otherwise the lighter is destroyed and the heavier's new weight is the difference. Return the weight of the last remaining stone, or \`0\` if none remain.

**Example**
\`\`\`
Input: stones = [2, 7, 4, 1, 8, 1]
Output: 1
\`\`\``,
    functionName: "lastStoneWeight",
    starterCode: `/**
 * @param {number[]} stones
 * @return {number}
 */
function lastStoneWeight(stones) {
  // your code here
}`,
    solutionCode: `function lastStoneWeight(stones) {
  const heap = [...stones].sort((a, b) => a - b);
  while (heap.length > 1) {
    const a = heap.pop();
    const b = heap.pop();
    if (a !== b) {
      const diff = a - b;
      let i = 0;
      while (i < heap.length && heap[i] < diff) i++;
      heap.splice(i, 0, diff);
    }
  }
  return heap.length ? heap[0] : 0;
}`,
    testCases: [
      { args: [[2, 7, 4, 1, 8, 1]], expected: 1 },
      { args: [[1]], expected: 1 },
      { args: [[2, 2]], expected: 0 },
    ],
    languages: {
      python: {
        functionName: "last_stone_weight",
        starterCode: `def last_stone_weight(stones: list[int]) -> int:
    # your code here
    pass`,
        solutionCode: `import heapq

def last_stone_weight(stones: list[int]) -> int:
    heap = [-s for s in stones]
    heapq.heapify(heap)
    while len(heap) > 1:
        a = -heapq.heappop(heap)
        b = -heapq.heappop(heap)
        if a != b:
            heapq.heappush(heap, -(a - b))
    return -heap[0] if heap else 0`,
      },
    },
  },
  {
    id: "k-closest-points-to-origin",
    title: "K Closest Points to Origin",
    category: "heap",
    difficulty: "medium",
    prompt: `Given an array of \`points\` where \`points[i] = [x, y]\`, return the \`k\` points closest to the origin \`(0, 0)\`, in any order. Distance is the usual Euclidean distance — comparing squared distances avoids the square root entirely.

Same "always grab the smallest/biggest remaining" shape as [Kth Largest Element](/practice/kth-largest-element), scored by distance instead of value.

**Example**
\`\`\`
Input: points = [[1, 3], [-2, 2]], k = 1
Output: [[-2, 2]]        // dist² 8 < dist² 10
\`\`\``,
    functionName: "kClosest",
    relatedAlgorithmId: "heap-sort",
    starterCode: `/**
 * @param {number[][]} points
 * @param {number} k
 * @return {number[][]}
 */
function kClosest(points, k) {
  // your code here
}`,
    solutionCode: `function kClosest(points, k) {
  return [...points]
    .sort((a, b) => (a[0] ** 2 + a[1] ** 2) - (b[0] ** 2 + b[1] ** 2))
    .slice(0, k);
}`,
    testCases: [
      { args: [[[1, 3], [-2, 2]], 1], expected: [[-2, 2]], unordered: true },
      {
        args: [[[3, 3], [5, -1], [-2, 4]], 2],
        expected: [[3, 3], [-2, 4]],
        unordered: true,
      },
    ],
    languages: {
      python: {
        functionName: "k_closest",
        starterCode: `def k_closest(points: list[list[int]], k: int) -> list[list[int]]:
    # your code here
    pass`,
        solutionCode: `def k_closest(points: list[list[int]], k: int) -> list[list[int]]:
    return sorted(points, key=lambda p: p[0] ** 2 + p[1] ** 2)[:k]`,
      },
    },
  },
];
