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
    languages: {
      python: {
        functionName: "subsets",
        starterCode: `def subsets(nums: list[int]) -> list[list[int]]:
    # your code here
    pass`,
        solutionCode: `def subsets(nums: list[int]) -> list[list[int]]:
    result = []

    def backtrack(start, path):
        result.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()

    backtrack(0, [])
    return result`,
      },
    },
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
    languages: {
      python: {
        functionName: "permute",
        starterCode: `def permute(nums: list[int]) -> list[list[int]]:
    # your code here
    pass`,
        solutionCode: `def permute(nums: list[int]) -> list[list[int]]:
    result = []

    def backtrack(path, remaining):
        if not remaining:
            result.append(path[:])
            return
        for i in range(len(remaining)):
            path.append(remaining[i])
            backtrack(path, remaining[:i] + remaining[i + 1:])
            path.pop()

    backtrack([], nums)
    return result`,
      },
    },
  },
  {
    id: "combination-sum",
    title: "Combination Sum",
    category: "backtracking",
    difficulty: "medium",
    prompt: `Given an array of distinct positive integers \`candidates\` and a \`target\`, return all unique combinations where the chosen numbers sum to \`target\`. The same number may be reused any number of times. Return the combinations in any order, each combination's numbers sorted ascending.

**Example**
\`\`\`
Input: candidates = [2, 3, 6, 7], target = 7
Output: [[2, 2, 3], [7]]
\`\`\``,
    functionName: "combinationSum",
    starterCode: `/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
function combinationSum(candidates, target) {
  // your code here
}`,
    solutionCode: `function combinationSum(candidates, target) {
  const result = [];
  const sorted = [...candidates].sort((a, b) => a - b);
  function backtrack(start, remaining, path) {
    if (remaining === 0) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < sorted.length; i++) {
      if (sorted[i] > remaining) break;
      path.push(sorted[i]);
      backtrack(i, remaining - sorted[i], path);
      path.pop();
    }
  }
  backtrack(0, target, []);
  return result;
}`,
    testCases: [
      {
        args: [[2, 3, 6, 7], 7],
        expected: [[2, 2, 3], [7]],
        unordered: true,
      },
      {
        args: [[2, 3, 5], 8],
        expected: [[2, 2, 2, 2], [2, 3, 3], [3, 5]],
        unordered: true,
      },
      { args: [[2], 1], expected: [], unordered: true },
    ],
    languages: {
      python: {
        functionName: "combination_sum",
        starterCode: `def combination_sum(candidates: list[int], target: int) -> list[list[int]]:
    # your code here
    pass`,
        solutionCode: `def combination_sum(candidates: list[int], target: int) -> list[list[int]]:
    result = []
    sorted_candidates = sorted(candidates)

    def backtrack(start, remaining, path):
        if remaining == 0:
            result.append(path[:])
            return
        for i in range(start, len(sorted_candidates)):
            if sorted_candidates[i] > remaining:
                break
            path.append(sorted_candidates[i])
            backtrack(i, remaining - sorted_candidates[i], path)
            path.pop()

    backtrack(0, target, [])
    return result`,
      },
    },
  },
  {
    id: "generate-parentheses",
    title: "Generate Parentheses",
    category: "backtracking",
    difficulty: "medium",
    prompt: `Given \`n\` pairs of parentheses, return all combinations of well-formed parenthesis strings, in any order.

Only add \`(\` while you still have some left to place, and only add \`)\` while fewer closes than opens have been placed so far — that constraint alone keeps every generated string balanced.

**Example**
\`\`\`
Input: n = 1
Output: ["()"]
\`\`\``,
    functionName: "generateParenthesis",
    starterCode: `/**
 * @param {number} n
 * @return {string[]}
 */
function generateParenthesis(n) {
  // your code here
}`,
    solutionCode: `function generateParenthesis(n) {
  const result = [];
  function backtrack(current, open, close) {
    if (current.length === 2 * n) {
      result.push(current);
      return;
    }
    if (open < n) backtrack(current + "(", open + 1, close);
    if (close < open) backtrack(current + ")", open, close + 1);
  }
  backtrack("", 0, 0);
  return result;
}`,
    testCases: [
      { args: [1], expected: ["()"], unordered: true },
      {
        args: [3],
        expected: ["((()))", "(()())", "(())()", "()(())", "()()()"],
        unordered: true,
      },
    ],
    languages: {
      python: {
        functionName: "generate_parenthesis",
        starterCode: `def generate_parenthesis(n: int) -> list[str]:
    # your code here
    pass`,
        solutionCode: `def generate_parenthesis(n: int) -> list[str]:
    result = []

    def backtrack(current, open_count, close_count):
        if len(current) == 2 * n:
            result.append(current)
            return
        if open_count < n:
            backtrack(current + "(", open_count + 1, close_count)
        if close_count < open_count:
            backtrack(current + ")", open_count, close_count + 1)

    backtrack("", 0, 0)
    return result`,
      },
    },
  },
];
