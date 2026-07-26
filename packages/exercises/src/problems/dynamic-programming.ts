import type { ExerciseDefinition } from "../types";

export const dynamicProgramming: ExerciseDefinition[] = [
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    category: "dynamic-programming",
    difficulty: "easy",
    prompt: `You're climbing a staircase with \`n\` steps. Each move you can climb 1 or 2 steps. Return the number of distinct ways to reach the top.

This count follows the exact recurrence in [Fibonacci memoization](/visualize?algo=fibonacci-memo) — ways(n) = ways(n-1) + ways(n-2).

**Example**
\`\`\`
Input: n = 4
Output: 5        // 1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2
\`\`\``,
    functionName: "climbStairs",
    relatedAlgorithmId: "fibonacci-memo",
    starterCode: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
  // your code here
}`,
    solutionCode: `function climbStairs(n) {
  if (n <= 2) return n;
  let prev2 = 1, prev1 = 2;
  for (let i = 3; i <= n; i++) {
    [prev2, prev1] = [prev1, prev1 + prev2];
  }
  return prev1;
}`,
    testCases: [
      { args: [2], expected: 2 },
      { args: [3], expected: 3 },
      { args: [4], expected: 5 },
      { args: [1], expected: 1 },
    ],
    languages: {
      python: {
        functionName: "climb_stairs",
        starterCode: `def climb_stairs(n: int) -> int:
    # your code here
    pass`,
        solutionCode: `def climb_stairs(n: int) -> int:
    if n <= 2:
        return n
    prev2, prev1 = 1, 2
    for _ in range(3, n + 1):
        prev2, prev1 = prev1, prev1 + prev2
    return prev1`,
      },
    },
  },
  {
    id: "house-robber",
    title: "House Robber",
    category: "dynamic-programming",
    difficulty: "medium",
    prompt: `You're a robber planning houses along a street, given as \`nums\` (money in each house). You can't rob two adjacent houses (it trips the alarm). Return the maximum money you can rob.

**Example**
\`\`\`
Input: nums = [2, 7, 9, 3, 1]
Output: 12        // rob houses 0, 2, 4 → 2 + 9 + 1
\`\`\``,
    functionName: "rob",
    starterCode: `/**
 * @param {number[]} nums
 * @return {number}
 */
function rob(nums) {
  // your code here
}`,
    solutionCode: `function rob(nums) {
  let take = 0, skip = 0;
  for (const money of nums) {
    [take, skip] = [skip + money, Math.max(take, skip)];
  }
  return Math.max(take, skip);
}`,
    testCases: [
      { args: [[1, 2, 3, 1]], expected: 4 },
      { args: [[2, 7, 9, 3, 1]], expected: 12 },
      { args: [[]], expected: 0 },
      { args: [[5]], expected: 5 },
    ],
    languages: {
      python: {
        functionName: "rob",
        starterCode: `def rob(nums: list[int]) -> int:
    # your code here
    pass`,
        solutionCode: `def rob(nums: list[int]) -> int:
    take, skip = 0, 0
    for money in nums:
        take, skip = skip + money, max(take, skip)
    return max(take, skip)`,
      },
    },
  },
  {
    id: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    category: "dynamic-programming",
    difficulty: "medium",
    prompt: `Given an integer array \`nums\`, return the length of the longest strictly increasing subsequence (elements don't need to be contiguous).

**Example**
\`\`\`
Input: nums = [10, 9, 2, 5, 3, 7, 101, 18]
Output: 4        // [2, 3, 7, 101] or [2, 3, 7, 18]
\`\`\``,
    functionName: "lengthOfLIS",
    starterCode: `/**
 * @param {number[]} nums
 * @return {number}
 */
function lengthOfLIS(nums) {
  // your code here
}`,
    solutionCode: `function lengthOfLIS(nums) {
  if (nums.length === 0) return 0;
  const dp = new Array(nums.length).fill(1);
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
  }
  return Math.max(...dp);
}`,
    testCases: [
      { args: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4 },
      { args: [[0, 1, 0, 3, 2, 3]], expected: 4 },
      { args: [[7, 7, 7, 7]], expected: 1 },
    ],
    languages: {
      python: {
        functionName: "length_of_lis",
        starterCode: `def length_of_lis(nums: list[int]) -> int:
    # your code here
    pass`,
        solutionCode: `def length_of_lis(nums: list[int]) -> int:
    if not nums:
        return 0
    dp = [1] * len(nums)
    for i in range(1, len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)`,
      },
    },
  },
];
