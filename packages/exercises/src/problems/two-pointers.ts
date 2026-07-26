import type { ExerciseDefinition } from "../types";

export const twoPointers: ExerciseDefinition[] = [
  {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    category: "two-pointers",
    difficulty: "easy",
    prompt: `Given a string \`s\`, return \`true\` if it reads the same forwards and backwards after removing every non-alphanumeric character and ignoring case.

**Example**
\`\`\`
Input: s = "A man, a plan, a canal: Panama"
Output: true
\`\`\``,
    functionName: "isPalindrome",
    starterCode: `/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
  // your code here
}`,
    solutionCode: `function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  let lo = 0, hi = clean.length - 1;
  while (lo < hi) {
    if (clean[lo] !== clean[hi]) return false;
    lo++; hi--;
  }
  return true;
}`,
    testCases: [
      { args: ["A man, a plan, a canal: Panama"], expected: true },
      { args: ["race a car"], expected: false },
      { args: [" "], expected: true },
      { args: ["0P"], expected: false },
    ],
    languages: {
      python: {
        functionName: "is_palindrome",
        starterCode: `def is_palindrome(s: str) -> bool:
    # your code here
    pass`,
        solutionCode: `def is_palindrome(s: str) -> bool:
    clean = [c.lower() for c in s if c.isalnum()]
    lo, hi = 0, len(clean) - 1
    while lo < hi:
        if clean[lo] != clean[hi]:
            return False
        lo += 1
        hi -= 1
    return True`,
      },
    },
  },
  {
    id: "two-sum-sorted",
    title: "Two Sum II — Sorted Input",
    category: "two-pointers",
    difficulty: "medium",
    prompt: `Given a 1-indexed array of integers \`numbers\` already sorted in ascending order, find two numbers that add up to \`target\`. Return their indices (1-indexed) as \`[i, j]\` with \`i < j\`.

Use O(1) extra space — the sorted order is the hint that two pointers beat a hash map here.

**Example**
\`\`\`
Input: numbers = [2, 7, 11, 15], target = 9
Output: [1, 2]
\`\`\``,
    functionName: "twoSumSorted",
    starterCode: `/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
function twoSumSorted(numbers, target) {
  // your code here
}`,
    solutionCode: `function twoSumSorted(numbers, target) {
  let lo = 0, hi = numbers.length - 1;
  while (lo < hi) {
    const sum = numbers[lo] + numbers[hi];
    if (sum === target) return [lo + 1, hi + 1];
    if (sum < target) lo++;
    else hi--;
  }
  return [];
}`,
    testCases: [
      { args: [[2, 7, 11, 15], 9], expected: [1, 2] },
      { args: [[2, 3, 4], 6], expected: [1, 3] },
      { args: [[-1, 0], -1], expected: [1, 2] },
    ],
  },
  {
    id: "container-with-most-water",
    title: "Container With Most Water",
    category: "two-pointers",
    difficulty: "medium",
    prompt: `You're given an array \`height\` where \`height[i]\` is the height of a vertical line at position \`i\`. Choose two lines that, together with the x-axis, form a container holding the most water. Return the maximum amount of water it can hold.

**Example**
\`\`\`
Input: height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
Output: 49
\`\`\``,
    functionName: "maxArea",
    starterCode: `/**
 * @param {number[]} height
 * @return {number}
 */
function maxArea(height) {
  // your code here
}`,
    solutionCode: `function maxArea(height) {
  let lo = 0, hi = height.length - 1, best = 0;
  while (lo < hi) {
    const area = Math.min(height[lo], height[hi]) * (hi - lo);
    best = Math.max(best, area);
    if (height[lo] < height[hi]) lo++;
    else hi--;
  }
  return best;
}`,
    testCases: [
      { args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
      { args: [[1, 1]], expected: 1 },
      { args: [[4, 3, 2, 1, 4]], expected: 16 },
    ],
  },
];
