import type { ExerciseDefinition } from "../types";

export const greedy: ExerciseDefinition[] = [
  {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    category: "greedy",
    difficulty: "medium",
    prompt: `Given an integer array \`nums\`, find the contiguous subarray with the largest sum and return that sum.

**Example**
\`\`\`
Input: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
Output: 6        // [4, -1, 2, 1]
\`\`\``,
    functionName: "maxSubArray",
    starterCode: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  // your code here
}`,
    solutionCode: `function maxSubArray(nums) {
  let best = nums[0];
  let current = nums[0];
  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
  }
  return best;
}`,
    testCases: [
      { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { args: [[1]], expected: 1 },
      { args: [[5, 4, -1, 7, 8]], expected: 23 },
      { args: [[-1, -2, -3]], expected: -1 },
    ],
    languages: {
      python: {
        functionName: "max_sub_array",
        starterCode: `def max_sub_array(nums: list[int]) -> int:
    # your code here
    pass`,
        solutionCode: `def max_sub_array(nums: list[int]) -> int:
    best = nums[0]
    current = nums[0]
    for n in nums[1:]:
        current = max(n, current + n)
        best = max(best, current)
    return best`,
      },
    },
  },
  {
    id: "jump-game",
    title: "Jump Game",
    category: "greedy",
    difficulty: "medium",
    prompt: `Given an array \`nums\` where \`nums[i]\` is the maximum jump length from position \`i\`, starting at index 0, return \`true\` if you can reach the last index.

**Example**
\`\`\`
Input: nums = [2, 3, 1, 1, 4]
Output: true

Input: nums = [3, 2, 1, 0, 4]
Output: false        // stuck at index 3
\`\`\``,
    functionName: "canJump",
    starterCode: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
function canJump(nums) {
  // your code here
}`,
    solutionCode: `function canJump(nums) {
  let reach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > reach) return false;
    reach = Math.max(reach, i + nums[i]);
  }
  return true;
}`,
    testCases: [
      { args: [[2, 3, 1, 1, 4]], expected: true },
      { args: [[3, 2, 1, 0, 4]], expected: false },
      { args: [[0]], expected: true },
      { args: [[1, 0, 1, 0]], expected: false },
    ],
  },
];
