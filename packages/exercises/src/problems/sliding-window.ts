import type { ExerciseDefinition } from "../types";

export const slidingWindow: ExerciseDefinition[] = [
  {
    id: "best-time-to-buy-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    category: "sliding-window",
    difficulty: "easy",
    prompt: `You're given an array \`prices\` where \`prices[i]\` is a stock's price on day \`i\`. You may buy on one day and sell on a later day, at most once. Return the maximum profit you can achieve, or \`0\` if no profit is possible.

**Example**
\`\`\`
Input: prices = [7, 1, 5, 3, 6, 4]
Output: 5        // buy at 1, sell at 6
\`\`\``,
    functionName: "maxProfit",
    starterCode: `/**
 * @param {number[]} prices
 * @return {number}
 */
function maxProfit(prices) {
  // your code here
}`,
    solutionCode: `function maxProfit(prices) {
  let minSoFar = Infinity;
  let best = 0;
  for (const price of prices) {
    minSoFar = Math.min(minSoFar, price);
    best = Math.max(best, price - minSoFar);
  }
  return best;
}`,
    testCases: [
      { args: [[7, 1, 5, 3, 6, 4]], expected: 5 },
      { args: [[7, 6, 4, 3, 1]], expected: 0 },
      { args: [[2, 4, 1]], expected: 2 },
      { args: [[1]], expected: 0 },
    ],
    languages: {
      python: {
        functionName: "max_profit",
        starterCode: `def max_profit(prices: list[int]) -> int:
    # your code here
    pass`,
        solutionCode: `def max_profit(prices: list[int]) -> int:
    min_so_far = float("inf")
    best = 0
    for price in prices:
        min_so_far = min(min_so_far, price)
        best = max(best, price - min_so_far)
    return best`,
      },
    },
  },
  {
    id: "longest-substring-without-repeating",
    title: "Longest Substring Without Repeating Characters",
    category: "sliding-window",
    difficulty: "medium",
    prompt: `Given a string \`s\`, return the length of the longest substring that contains no repeated characters.

**Example**
\`\`\`
Input: s = "abcabcbb"
Output: 3        // "abc"
\`\`\``,
    functionName: "lengthOfLongestSubstring",
    starterCode: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // your code here
}`,
    solutionCode: `function lengthOfLongestSubstring(s) {
  const lastSeen = new Map();
  let start = 0, best = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (lastSeen.has(ch) && lastSeen.get(ch) >= start) {
      start = lastSeen.get(ch) + 1;
    }
    lastSeen.set(ch, i);
    best = Math.max(best, i - start + 1);
  }
  return best;
}`,
    testCases: [
      { args: ["abcabcbb"], expected: 3 },
      { args: ["bbbbb"], expected: 1 },
      { args: ["pwwkew"], expected: 3 },
      { args: [""], expected: 0 },
    ],
    languages: {
      python: {
        functionName: "length_of_longest_substring",
        starterCode: `def length_of_longest_substring(s: str) -> int:
    # your code here
    pass`,
        solutionCode: `def length_of_longest_substring(s: str) -> int:
    last_seen = {}
    start = 0
    best = 0
    for i, ch in enumerate(s):
        if ch in last_seen and last_seen[ch] >= start:
            start = last_seen[ch] + 1
        last_seen[ch] = i
        best = max(best, i - start + 1)
    return best`,
      },
    },
  },
];
