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
  {
    id: "coin-change",
    title: "Coin Change",
    category: "dynamic-programming",
    difficulty: "medium",
    prompt: `You're given an array \`coins\` of coin denominations and an integer \`amount\`. Return the fewest number of coins needed to make up \`amount\` (unlimited supply of each coin), or \`-1\` if it can't be made.

Same table-filling idea as [0/1 Knapsack](/visualize?algo=knapsack), except each coin can be reused — so the inner loop reads from the *current* row, not a previous one.

**Example**
\`\`\`
Input: coins = [1, 2, 5], amount = 11
Output: 3        // 5 + 5 + 1
\`\`\``,
    functionName: "coinChange",
    relatedAlgorithmId: "knapsack",
    starterCode: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
function coinChange(coins, amount) {
  // your code here
}`,
    solutionCode: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    testCases: [
      { args: [[1, 2, 5], 11], expected: 3 },
      { args: [[2], 3], expected: -1 },
      { args: [[1], 0], expected: 0 },
    ],
    languages: {
      python: {
        functionName: "coin_change",
        starterCode: `def coin_change(coins: list[int], amount: int) -> int:
    # your code here
    pass`,
        solutionCode: `def coin_change(coins: list[int], amount: int) -> int:
    dp = [float("inf")] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != float("inf") else -1`,
      },
    },
  },
  {
    id: "unique-paths",
    title: "Unique Paths",
    category: "dynamic-programming",
    difficulty: "medium",
    prompt: `A robot starts at the top-left corner of an \`m x n\` grid and can only move right or down. Return how many distinct paths lead to the bottom-right corner.

**Example**
\`\`\`
Input: m = 3, n = 7
Output: 28
\`\`\``,
    functionName: "uniquePaths",
    starterCode: `/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
function uniquePaths(m, n) {
  // your code here
}`,
    solutionCode: `function uniquePaths(m, n) {
  const dp = new Array(n).fill(1);
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] += dp[j - 1];
    }
  }
  return dp[n - 1];
}`,
    testCases: [
      { args: [3, 7], expected: 28 },
      { args: [3, 2], expected: 3 },
      { args: [1, 1], expected: 1 },
    ],
    languages: {
      python: {
        functionName: "unique_paths",
        starterCode: `def unique_paths(m: int, n: int) -> int:
    # your code here
    pass`,
        solutionCode: `def unique_paths(m: int, n: int) -> int:
    dp = [1] * n
    for _ in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j - 1]
    return dp[n - 1]`,
      },
    },
  },
  {
    id: "word-break",
    title: "Word Break",
    category: "dynamic-programming",
    difficulty: "medium",
    prompt: `Given a string \`s\` and a list of strings \`wordDict\`, return \`true\` if \`s\` can be split into a sequence of one or more dictionary words (each word may be reused any number of times).

\`dp[i]\` means "the first \`i\` characters of \`s\` can be fully segmented" — it's true if some earlier \`dp[j]\` is true and \`s[j:i]\` is in the dictionary.

**Example**
\`\`\`
Input: s = "leetcode", wordDict = ["leet", "code"]
Output: true
\`\`\``,
    functionName: "wordBreak",
    starterCode: `/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
function wordBreak(s, wordDict) {
  // your code here
}`,
    solutionCode: `function wordBreak(s, wordDict) {
  const words = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && words.has(s.slice(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}`,
    testCases: [
      { args: ["leetcode", ["leet", "code"]], expected: true },
      { args: ["applepenapple", ["apple", "pen"]], expected: true },
      { args: ["catsandog", ["cats", "dog", "sand", "and", "cat"]], expected: false },
    ],
    languages: {
      python: {
        functionName: "word_break",
        starterCode: `def word_break(s: str, word_dict: list[str]) -> bool:
    # your code here
    pass`,
        solutionCode: `def word_break(s: str, word_dict: list[str]) -> bool:
    words = set(word_dict)
    dp = [False] * (len(s) + 1)
    dp[0] = True
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[len(s)]`,
      },
    },
  },
];
