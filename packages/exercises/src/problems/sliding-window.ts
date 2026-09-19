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
  {
    id: "longest-repeating-character-replacement",
    title: "Longest Repeating Character Replacement",
    category: "sliding-window",
    difficulty: "medium",
    prompt: `Given a string \`s\` and an integer \`k\`, you may replace up to \`k\` characters with any other uppercase letter. Return the length of the longest substring you can make consist of a single repeated letter.

Track the count of the most frequent letter inside the window — once \`(window size - that count)\` exceeds \`k\`, too many characters would need replacing, so shrink from the left.

**Example**
\`\`\`
Input: s = "ABAB", k = 2
Output: 4        // replace both B's (or both A's)
\`\`\``,
    functionName: "characterReplacement",
    starterCode: `/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
function characterReplacement(s, k) {
  // your code here
}`,
    solutionCode: `function characterReplacement(s, k) {
  const counts = {};
  let start = 0, maxCount = 0, best = 0;
  for (let end = 0; end < s.length; end++) {
    const c = s[end];
    counts[c] = (counts[c] ?? 0) + 1;
    maxCount = Math.max(maxCount, counts[c]);
    while (end - start + 1 - maxCount > k) {
      counts[s[start]]--;
      start++;
    }
    best = Math.max(best, end - start + 1);
  }
  return best;
}`,
    testCases: [
      { args: ["ABAB", 2], expected: 4 },
      { args: ["AABABBA", 1], expected: 4 },
      { args: ["", 0], expected: 0 },
    ],
    languages: {
      python: {
        functionName: "character_replacement",
        starterCode: `def character_replacement(s: str, k: int) -> int:
    # your code here
    pass`,
        solutionCode: `def character_replacement(s: str, k: int) -> int:
    counts = {}
    start = 0
    max_count = 0
    best = 0
    for end, c in enumerate(s):
        counts[c] = counts.get(c, 0) + 1
        max_count = max(max_count, counts[c])
        while (end - start + 1) - max_count > k:
            counts[s[start]] -= 1
            start += 1
        best = max(best, end - start + 1)
    return best`,
      },
    },
  },
  {
    id: "permutation-in-string",
    title: "Permutation in String",
    category: "sliding-window",
    difficulty: "medium",
    prompt: `Given two strings \`s1\` and \`s2\`, return \`true\` if \`s2\` contains a permutation of \`s1\` as a contiguous substring — same letters as \`s1\`, same counts, any order.

A fixed-size window of length \`s1.length\` slides across \`s2\`; compare letter-count tables instead of re-sorting each window.

**Example**
\`\`\`
Input: s1 = "ab", s2 = "eidbaooo"
Output: true        // "ba" is a permutation of "ab"
\`\`\``,
    functionName: "checkInclusion",
    starterCode: `/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
function checkInclusion(s1, s2) {
  // your code here
}`,
    solutionCode: `function checkInclusion(s1, s2) {
  if (s1.length > s2.length) return false;
  const need = new Array(26).fill(0);
  const window = new Array(26).fill(0);
  const a = "a".charCodeAt(0);
  for (const c of s1) need[c.charCodeAt(0) - a]++;
  for (let i = 0; i < s2.length; i++) {
    window[s2.charCodeAt(i) - a]++;
    if (i >= s1.length) window[s2.charCodeAt(i - s1.length) - a]--;
    if (i >= s1.length - 1 && need.every((v, idx) => v === window[idx])) return true;
  }
  return false;
}`,
    testCases: [
      { args: ["ab", "eidbaooo"], expected: true },
      { args: ["ab", "eidboaoo"], expected: false },
      { args: ["adc", "dcda"], expected: true },
    ],
    languages: {
      python: {
        functionName: "check_inclusion",
        starterCode: `def check_inclusion(s1: str, s2: str) -> bool:
    # your code here
    pass`,
        solutionCode: `def check_inclusion(s1: str, s2: str) -> bool:
    if len(s1) > len(s2):
        return False
    need = [0] * 26
    window = [0] * 26
    a = ord("a")
    for c in s1:
        need[ord(c) - a] += 1
    for i, c in enumerate(s2):
        window[ord(c) - a] += 1
        if i >= len(s1):
            window[ord(s2[i - len(s1)]) - a] -= 1
        if i >= len(s1) - 1 and need == window:
            return True
    return False`,
      },
    },
  },
];
