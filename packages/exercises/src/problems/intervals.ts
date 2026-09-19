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
  {
    id: "non-overlapping-intervals",
    title: "Non-overlapping Intervals",
    category: "intervals",
    difficulty: "medium",
    prompt: `Given an array of intervals \`[start, end]\`, return the minimum number of intervals you'd need to remove so that none of the remaining ones overlap.

Sort by end time and greedily keep whichever interval finishes earliest — it leaves the most room for everything after it, so anything that overlaps the one you kept must be removed instead.

**Example**
\`\`\`
Input: intervals = [[1, 2], [2, 3], [3, 4], [1, 3]]
Output: 1        // remove [1, 3]
\`\`\``,
    functionName: "eraseOverlapIntervals",
    starterCode: `/**
 * @param {number[][]} intervals
 * @return {number}
 */
function eraseOverlapIntervals(intervals) {
  // your code here
}`,
    solutionCode: `function eraseOverlapIntervals(intervals) {
  if (intervals.length === 0) return 0;
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  let count = 0;
  let end = sorted[0][1];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i][0] < end) {
      count++;
    } else {
      end = sorted[i][1];
    }
  }
  return count;
}`,
    testCases: [
      { args: [[[1, 2], [2, 3], [3, 4], [1, 3]]], expected: 1 },
      { args: [[[1, 2], [1, 2], [1, 2]]], expected: 2 },
      { args: [[[1, 2], [2, 3]]], expected: 0 },
    ],
    languages: {
      python: {
        functionName: "erase_overlap_intervals",
        starterCode: `def erase_overlap_intervals(intervals: list[list[int]]) -> int:
    # your code here
    pass`,
        solutionCode: `def erase_overlap_intervals(intervals: list[list[int]]) -> int:
    if not intervals:
        return 0
    ordered = sorted(intervals, key=lambda iv: iv[1])
    count = 0
    end = ordered[0][1]
    for start, finish in ordered[1:]:
        if start < end:
            count += 1
        else:
            end = finish
    return count`,
      },
    },
  },
];
