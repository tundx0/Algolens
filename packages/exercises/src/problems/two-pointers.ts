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
    languages: {
      python: {
        functionName: "two_sum_sorted",
        starterCode: `def two_sum_sorted(numbers: list[int], target: int) -> list[int]:
    # your code here
    pass`,
        solutionCode: `def two_sum_sorted(numbers: list[int], target: int) -> list[int]:
    lo, hi = 0, len(numbers) - 1
    while lo < hi:
        total = numbers[lo] + numbers[hi]
        if total == target:
            return [lo + 1, hi + 1]
        if total < target:
            lo += 1
        else:
            hi -= 1
    return []`,
      },
    },
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
    languages: {
      python: {
        functionName: "max_area",
        starterCode: `def max_area(height: list[int]) -> int:
    # your code here
    pass`,
        solutionCode: `def max_area(height: list[int]) -> int:
    lo, hi = 0, len(height) - 1
    best = 0
    while lo < hi:
        area = min(height[lo], height[hi]) * (hi - lo)
        best = max(best, area)
        if height[lo] < height[hi]:
            lo += 1
        else:
            hi -= 1
    return best`,
      },
    },
  },
  {
    id: "three-sum",
    title: "3Sum",
    category: "two-pointers",
    difficulty: "medium",
    prompt: `Given an integer array \`nums\`, return all unique triplets \`[nums[i], nums[j], nums[k]]\` (i, j, k all different) that sum to \`0\`. Each triplet's numbers should be sorted ascending, and the triplets themselves may be returned in any order — no duplicate triplets.

Sort first, fix one number, then two-point the rest — the same shape as [Two Sum II](/practice/two-sum-sorted), one level up.

**Example**
\`\`\`
Input: nums = [-1, 0, 1, 2, -1, -4]
Output: [[-1, -1, 2], [-1, 0, 1]]
\`\`\``,
    functionName: "threeSum",
    starterCode: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums) {
  // your code here
}`,
    solutionCode: `function threeSum(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length - 2; i++) {
    if (i > 0 && sorted[i] === sorted[i - 1]) continue;
    let lo = i + 1, hi = sorted.length - 1;
    while (lo < hi) {
      const sum = sorted[i] + sorted[lo] + sorted[hi];
      if (sum === 0) {
        result.push([sorted[i], sorted[lo], sorted[hi]]);
        lo++; hi--;
        while (lo < hi && sorted[lo] === sorted[lo - 1]) lo++;
        while (lo < hi && sorted[hi] === sorted[hi + 1]) hi--;
      } else if (sum < 0) {
        lo++;
      } else {
        hi--;
      }
    }
  }
  return result;
}`,
    testCases: [
      {
        args: [[-1, 0, 1, 2, -1, -4]],
        expected: [[-1, -1, 2], [-1, 0, 1]],
        unordered: true,
      },
      { args: [[0, 1, 1]], expected: [], unordered: true },
      { args: [[0, 0, 0, 0]], expected: [[0, 0, 0]], unordered: true },
    ],
    languages: {
      python: {
        functionName: "three_sum",
        starterCode: `def three_sum(nums: list[int]) -> list[list[int]]:
    # your code here
    pass`,
        solutionCode: `def three_sum(nums: list[int]) -> list[list[int]]:
    sorted_nums = sorted(nums)
    result = []
    n = len(sorted_nums)
    for i in range(n - 2):
        if i > 0 and sorted_nums[i] == sorted_nums[i - 1]:
            continue
        lo, hi = i + 1, n - 1
        while lo < hi:
            total = sorted_nums[i] + sorted_nums[lo] + sorted_nums[hi]
            if total == 0:
                result.append([sorted_nums[i], sorted_nums[lo], sorted_nums[hi]])
                lo += 1
                hi -= 1
                while lo < hi and sorted_nums[lo] == sorted_nums[lo - 1]:
                    lo += 1
                while lo < hi and sorted_nums[hi] == sorted_nums[hi + 1]:
                    hi -= 1
            elif total < 0:
                lo += 1
            else:
                hi -= 1
    return result`,
      },
    },
  },
  {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    category: "two-pointers",
    difficulty: "hard",
    prompt: `Given \`height\`, an elevation map where \`height[i]\` is the height of a 1-unit-wide bar at position \`i\`, compute how much water it can trap after raining.

Two pointers closing in from both ends, each tracking the tallest wall seen so far on its own side, beats the naive per-column max-left/max-right scan without extra arrays.

**Example**
\`\`\`
Input: height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
Output: 6
\`\`\``,
    functionName: "trap",
    starterCode: `/**
 * @param {number[]} height
 * @return {number}
 */
function trap(height) {
  // your code here
}`,
    solutionCode: `function trap(height) {
  let lo = 0, hi = height.length - 1;
  let leftMax = 0, rightMax = 0, water = 0;
  while (lo < hi) {
    if (height[lo] < height[hi]) {
      leftMax = Math.max(leftMax, height[lo]);
      water += leftMax - height[lo];
      lo++;
    } else {
      rightMax = Math.max(rightMax, height[hi]);
      water += rightMax - height[hi];
      hi--;
    }
  }
  return water;
}`,
    testCases: [
      { args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
      { args: [[4, 2, 0, 3, 2, 5]], expected: 9 },
      { args: [[]], expected: 0 },
    ],
    languages: {
      python: {
        functionName: "trap",
        starterCode: `def trap(height: list[int]) -> int:
    # your code here
    pass`,
        solutionCode: `def trap(height: list[int]) -> int:
    lo, hi = 0, len(height) - 1
    left_max = right_max = water = 0
    while lo < hi:
        if height[lo] < height[hi]:
            left_max = max(left_max, height[lo])
            water += left_max - height[lo]
            lo += 1
        else:
            right_max = max(right_max, height[hi])
            water += right_max - height[hi]
            hi -= 1
    return water`,
      },
    },
  },
];
