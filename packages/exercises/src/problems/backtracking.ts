import type { ExerciseDefinition } from "../types";

export const backtracking: ExerciseDefinition[] = [
  {
    id: "subsets",
    title: "Subsets",
    category: "backtracking",
    difficulty: "medium",
    prompt: `Given an array \`nums\` of unique integers, return all possible subsets (the power set). You may return them in any order.

**Example**
\`\`\`
Input: nums = [1, 2, 3]
Output: [[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]]
\`\`\``,
    functionName: "subsets",
    starterCode: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function subsets(nums) {
  // your code here
}`,
    solutionCode: `function subsets(nums) {
  const result = [];
  function backtrack(start, path) {
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  }
  backtrack(0, []);
  return result;
}`,
    testCases: [
      {
        args: [[1, 2, 3]],
        expected: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]],
        unordered: true,
      },
      { args: [[0]], expected: [[], [0]], unordered: true },
    ],
  },
  {
    id: "permutations",
    title: "Permutations",
    category: "backtracking",
    difficulty: "medium",
    prompt: `Given an array \`nums\` of unique integers, return all possible orderings of its elements. You may return them in any order.

**Example**
\`\`\`
Input: nums = [1, 2, 3]
Output: [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
\`\`\``,
    functionName: "permute",
    starterCode: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function permute(nums) {
  // your code here
}`,
    solutionCode: `function permute(nums) {
  const result = [];
  function backtrack(path, remaining) {
    if (remaining.length === 0) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < remaining.length; i++) {
      path.push(remaining[i]);
      backtrack(path, [...remaining.slice(0, i), ...remaining.slice(i + 1)]);
      path.pop();
    }
  }
  backtrack([], nums);
  return result;
}`,
    testCases: [
      {
        args: [[1, 2, 3]],
        expected: [
          [1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1],
        ],
        unordered: true,
      },
      { args: [[0, 1]], expected: [[0, 1], [1, 0]], unordered: true },
    ],
  },
];
