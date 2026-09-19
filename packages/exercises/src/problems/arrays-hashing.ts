import type { ExerciseDefinition } from "../types";

export const arraysHashing: ExerciseDefinition[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    category: "arrays-hashing",
    difficulty: "easy",
    prompt: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers that add up to \`target\`.

You may assume each input has exactly one valid answer, and you can't use the same element twice. Return the indices in either order.

**Example**
\`\`\`
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]        // nums[0] + nums[1] = 2 + 7 = 9
\`\`\`

**Constraints**
- 2 <= nums.length <= 10^4
- Exactly one valid pair exists.`,
    functionName: "twoSum",
    starterCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // your code here
}`,
    solutionCode: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) return [seen.get(complement), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
    testCases: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1] },
      { args: [[-1, -2, -3, -4, -5], -8], expected: [2, 4] },
    ],
    languages: {
      python: {
        functionName: "two_sum",
        starterCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    # your code here
    pass`,
        solutionCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, n in enumerate(nums):
        complement = target - n
        if complement in seen:
            return [seen[complement], i]
        seen[n] = i
    return []`,
      },
    },
  },
  {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    category: "arrays-hashing",
    difficulty: "easy",
    prompt: `Given an integer array \`nums\`, return \`true\` if any value appears at least twice, and \`false\` if every element is distinct.

**Example**
\`\`\`
Input: nums = [1, 2, 3, 1]
Output: true
\`\`\``,
    functionName: "containsDuplicate",
    starterCode: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
function containsDuplicate(nums) {
  // your code here
}`,
    solutionCode: `function containsDuplicate(nums) {
  return new Set(nums).size !== nums.length;
}`,
    testCases: [
      { args: [[1, 2, 3, 1]], expected: true },
      { args: [[1, 2, 3, 4]], expected: false },
      { args: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true },
      { args: [[]], expected: false },
    ],
    languages: {
      python: {
        functionName: "contains_duplicate",
        starterCode: `def contains_duplicate(nums: list[int]) -> bool:
    # your code here
    pass`,
        solutionCode: `def contains_duplicate(nums: list[int]) -> bool:
    return len(set(nums)) != len(nums)`,
      },
    },
  },
  {
    id: "group-anagrams",
    title: "Group Anagrams",
    category: "arrays-hashing",
    difficulty: "medium",
    prompt: `Given an array of strings \`strs\`, group the anagrams together. You can return the groups in any order, and the strings within a group can be in any order.

Two strings are anagrams if one can be rearranged into the other using all the original letters exactly once.

**Example**
\`\`\`
Input: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
Output: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]
\`\`\``,
    functionName: "groupAnagrams",
    starterCode: `/**
 * @param {string[]} strs
 * @return {string[][]}
 */
function groupAnagrams(strs) {
  // your code here
}`,
    solutionCode: `function groupAnagrams(strs) {
  const groups = new Map();
  for (const s of strs) {
    const key = [...s].sort().join("");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  return [...groups.values()];
}`,
    testCases: [
      {
        args: [["eat", "tea", "tan", "ate", "nat", "bat"]],
        expected: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]],
        unordered: true,
      },
      { args: [[""]], expected: [[""]], unordered: true },
      { args: [["a"]], expected: [["a"]], unordered: true },
    ],
    languages: {
      python: {
        functionName: "group_anagrams",
        starterCode: `def group_anagrams(strs: list[str]) -> list[list[str]]:
    # your code here
    pass`,
        solutionCode: `def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups = {}
    for s in strs:
        key = "".join(sorted(s))
        groups.setdefault(key, []).append(s)
    return list(groups.values())`,
      },
    },
  },
  {
    id: "top-k-frequent-elements",
    title: "Top K Frequent Elements",
    category: "arrays-hashing",
    difficulty: "medium",
    prompt: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements. You may return the answer in any order.

**Example**
\`\`\`
Input: nums = [1, 1, 1, 2, 2, 3], k = 2
Output: [1, 2]
\`\`\``,
    functionName: "topKFrequent",
    starterCode: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
function topKFrequent(nums, k) {
  // your code here
}`,
    solutionCode: `function topKFrequent(nums, k) {
  const counts = new Map();
  for (const n of nums) counts.set(n, (counts.get(n) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([n]) => n);
}`,
    testCases: [
      { args: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2], unordered: true },
      { args: [[1], 1], expected: [1] },
      { args: [[4, 1, 1, 1, 2, 2, 3], 2], expected: [1, 2], unordered: true },
    ],
    languages: {
      python: {
        functionName: "top_k_frequent",
        starterCode: `def top_k_frequent(nums: list[int], k: int) -> list[int]:
    # your code here
    pass`,
        solutionCode: `def top_k_frequent(nums: list[int], k: int) -> list[int]:
    counts = {}
    for n in nums:
        counts[n] = counts.get(n, 0) + 1
    return [n for n, _ in sorted(counts.items(), key=lambda kv: -kv[1])[:k]]`,
      },
    },
  },
  {
    id: "valid-anagram",
    title: "Valid Anagram",
    category: "arrays-hashing",
    difficulty: "easy",
    prompt: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\` — the same letters, the same number of times, in any order.

**Example**
\`\`\`
Input: s = "anagram", t = "nagaram"
Output: true

Input: s = "rat", t = "car"
Output: false
\`\`\``,
    functionName: "isAnagram",
    starterCode: `/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
function isAnagram(s, t) {
  // your code here
}`,
    solutionCode: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const counts = {};
  for (const c of s) counts[c] = (counts[c] ?? 0) + 1;
  for (const c of t) {
    if (!counts[c]) return false;
    counts[c]--;
  }
  return true;
}`,
    testCases: [
      { args: ["anagram", "nagaram"], expected: true },
      { args: ["rat", "car"], expected: false },
      { args: ["", ""], expected: true },
      { args: ["a", "ab"], expected: false },
    ],
    languages: {
      python: {
        functionName: "is_anagram",
        starterCode: `def is_anagram(s: str, t: str) -> bool:
    # your code here
    pass`,
        solutionCode: `def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    counts = {}
    for c in s:
        counts[c] = counts.get(c, 0) + 1
    for c in t:
        if counts.get(c, 0) == 0:
            return False
        counts[c] -= 1
    return True`,
      },
    },
  },
  {
    id: "product-of-array-except-self",
    title: "Product of Array Except Self",
    category: "arrays-hashing",
    difficulty: "medium",
    prompt: `Given an integer array \`nums\`, return an array \`answer\` where \`answer[i]\` is the product of every element in \`nums\` except \`nums[i]\`.

Do it in O(n) time without using division, and without the division operator anywhere in your solution.

**Example**
\`\`\`
Input: nums = [1, 2, 3, 4]
Output: [24, 12, 8, 6]
\`\`\``,
    functionName: "productExceptSelf",
    starterCode: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
function productExceptSelf(nums) {
  // your code here
}`,
    solutionCode: `function productExceptSelf(nums) {
  const n = nums.length;
  const result = new Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    result[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= suffix;
    suffix *= nums[i];
  }
  return result;
}`,
    testCases: [
      { args: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
      { args: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] },
      { args: [[2, 3]], expected: [3, 2] },
    ],
    languages: {
      python: {
        functionName: "product_except_self",
        starterCode: `def product_except_self(nums: list[int]) -> list[int]:
    # your code here
    pass`,
        solutionCode: `def product_except_self(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [1] * n
    prefix = 1
    for i in range(n):
        result[i] = prefix
        prefix *= nums[i]
    suffix = 1
    for i in range(n - 1, -1, -1):
        result[i] *= suffix
        suffix *= nums[i]
    return result`,
      },
    },
  },
  {
    id: "longest-consecutive-sequence",
    title: "Longest Consecutive Sequence",
    category: "arrays-hashing",
    difficulty: "medium",
    prompt: `Given an unsorted array of integers \`nums\`, return the length of the longest run of consecutive integers it contains (the numbers don't need to be adjacent in the array, just present in it). Do it in O(n) time.

**Example**
\`\`\`
Input: nums = [100, 4, 200, 1, 3, 2]
Output: 4        // the run 1, 2, 3, 4
\`\`\``,
    functionName: "longestConsecutive",
    starterCode: `/**
 * @param {number[]} nums
 * @return {number}
 */
function longestConsecutive(nums) {
  // your code here
}`,
    solutionCode: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const n of set) {
    if (!set.has(n - 1)) {
      let length = 1;
      let current = n;
      while (set.has(current + 1)) {
        current++;
        length++;
      }
      best = Math.max(best, length);
    }
  }
  return best;
}`,
    testCases: [
      { args: [[100, 4, 200, 1, 3, 2]], expected: 4 },
      { args: [[]], expected: 0 },
      { args: [[1, 2, 0, 1]], expected: 3 },
    ],
    languages: {
      python: {
        functionName: "longest_consecutive",
        starterCode: `def longest_consecutive(nums: list[int]) -> int:
    # your code here
    pass`,
        solutionCode: `def longest_consecutive(nums: list[int]) -> int:
    num_set = set(nums)
    best = 0
    for n in num_set:
        if n - 1 not in num_set:
            length = 1
            current = n
            while current + 1 in num_set:
                current += 1
                length += 1
            best = max(best, length)
    return best`,
      },
    },
  },
];
