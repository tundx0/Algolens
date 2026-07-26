import type { ExerciseDefinition } from "../types";

export const intervals: ExerciseDefinition[] = [
  {
    id: "merge-intervals",
    title: "Merge Intervals",
    category: "intervals",
    difficulty: "medium",
    prompt: `Given an array of intervals \`[start, end]\`, merge all overlapping intervals and return the non-overlapping intervals that cover all the input ranges. Intervals aren't guaranteed to be sorted.

**Example**
\`\`\`
Input: intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]
Output: [[1, 6], [8, 10], [15, 18]]
\`\`\``,
    functionName: "mergeIntervals",
    starterCode: `/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
function mergeIntervals(intervals) {
  // your code here
}`,
    solutionCode: `function mergeIntervals(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const result = [];
  for (const [start, end] of sorted) {
    const last = result[result.length - 1];
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      result.push([start, end]);
    }
  }
  return result;
}`,
    testCases: [
      {
        args: [[[1, 3], [2, 6], [8, 10], [15, 18]]],
        expected: [[1, 6], [8, 10], [15, 18]],
      },
      { args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
      { args: [[[1, 4], [0, 4]]], expected: [[0, 4]] },
    ],
    languages: {
      python: {
        functionName: "merge_intervals",
        starterCode: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    # your code here
    pass`,
        solutionCode: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    ordered = sorted(intervals, key=lambda iv: iv[0])
    result = []
    for start, end in ordered:
        if result and start <= result[-1][1]:
            result[-1][1] = max(result[-1][1], end)
        else:
            result.append([start, end])
    return result`,
      },
    },
  },
  {
    id: "insert-interval",
    title: "Insert Interval",
    category: "intervals",
    difficulty: "medium",
    prompt: `You're given a list of non-overlapping intervals sorted by start time, and a new interval \`newInterval\`. Insert it, merging any overlaps, and return the resulting sorted, non-overlapping list.

**Example**
\`\`\`
Input: intervals = [[1, 3], [6, 9]], newInterval = [2, 5]
Output: [[1, 5], [6, 9]]
\`\`\``,
    functionName: "insertInterval",
    starterCode: `/**
 * @param {number[][]} intervals
 * @param {number[]} newInterval
 * @return {number[][]}
 */
function insertInterval(intervals, newInterval) {
  // your code here
}`,
    solutionCode: `function insertInterval(intervals, newInterval) {
  const result = [];
  let [start, end] = newInterval;
  let i = 0;

  while (i < intervals.length && intervals[i][1] < start) {
    result.push(intervals[i++]);
  }
  while (i < intervals.length && intervals[i][0] <= end) {
    start = Math.min(start, intervals[i][0]);
    end = Math.max(end, intervals[i][1]);
    i++;
  }
  result.push([start, end]);
  while (i < intervals.length) {
    result.push(intervals[i++]);
  }
  return result;
}`,
    testCases: [
      {
        args: [[[1, 3], [6, 9]], [2, 5]],
        expected: [[1, 5], [6, 9]],
      },
      {
        args: [[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]],
        expected: [[1, 2], [3, 10], [12, 16]],
      },
      { args: [[], [5, 7]], expected: [[5, 7]] },
    ],
    languages: {
      python: {
        functionName: "insert_interval",
        starterCode: `def insert_interval(intervals: list[list[int]], new_interval: list[int]) -> list[list[int]]:
    # your code here
    pass`,
        solutionCode: `def insert_interval(intervals: list[list[int]], new_interval: list[int]) -> list[list[int]]:
    result = []
    start, end = new_interval
    i = 0
    n = len(intervals)

    while i < n and intervals[i][1] < start:
        result.append(intervals[i])
        i += 1
    while i < n and intervals[i][0] <= end:
        start = min(start, intervals[i][0])
        end = max(end, intervals[i][1])
        i += 1
    result.append([start, end])
    while i < n:
        result.append(intervals[i])
        i += 1
    return result`,
      },
    },
  },
];
