import type { ExerciseDefinition } from "../types";

export const binarySearch: ExerciseDefinition[] = [
  {
    id: "binary-search-basic",
    title: "Binary Search",
    category: "binary-search",
    difficulty: "easy",
    prompt: `Given a sorted array of distinct integers \`nums\` and a \`target\`, return the index of \`target\` if it exists, otherwise return \`-1\`. Your solution must run in O(log n).

This is the coding counterpart to the [Binary Search visualization](/visualize?algo=binary-search) — same idea, now write the code yourself.

**Example**
\`\`\`
Input: nums = [-1, 0, 3, 5, 9, 12], target = 9
Output: 4
\`\`\``,
    functionName: "search",
    relatedAlgorithmId: "binary-search",
    starterCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
  // your code here
}`,
    solutionCode: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    testCases: [
      { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
      { args: [[5], 5], expected: 0 },
      { args: [[], 5], expected: -1 },
    ],
    languages: {
      python: {
        functionName: "search",
        starterCode: `def search(nums: list[int], target: int) -> int:
    # your code here
    pass`,
        solutionCode: `def search(nums: list[int], target: int) -> int:
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
      },
    },
  },
  {
    id: "search-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    category: "binary-search",
    difficulty: "medium",
    prompt: `A sorted array has been rotated at an unknown pivot (e.g. \`[0,1,2,4,5,6,7]\` becomes \`[4,5,6,7,0,1,2]\`). Given the rotated array \`nums\` (distinct values) and a \`target\`, return its index, or \`-1\` if it isn't present. Your solution must run in O(log n).

**Example**
\`\`\`
Input: nums = [4, 5, 6, 7, 0, 1, 2], target = 0
Output: 4
\`\`\``,
    functionName: "searchRotated",
    starterCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function searchRotated(nums, target) {
  // your code here
}`,
    solutionCode: `function searchRotated(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;

    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`,
    testCases: [
      { args: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
      { args: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
      { args: [[1], 0], expected: -1 },
      { args: [[5, 1, 3], 5], expected: 0 },
    ],
    languages: {
      python: {
        functionName: "search_rotated",
        starterCode: `def search_rotated(nums: list[int], target: int) -> int:
    # your code here
    pass`,
        solutionCode: `def search_rotated(nums: list[int], target: int) -> int:
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
      },
    },
  },
];
