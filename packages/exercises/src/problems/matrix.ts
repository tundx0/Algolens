import type { ExerciseDefinition } from "../types";

export const matrix: ExerciseDefinition[] = [
  {
    id: "rotate-image",
    title: "Rotate Image",
    category: "matrix",
    difficulty: "medium",
    prompt: `You're given an \`n x n\` 2D matrix representing an image. Rotate it 90 degrees clockwise, in place, and return it.

Transpose the matrix (flip across the main diagonal), then reverse each row — two simple operations that together produce a clockwise rotation without any extra matrix.

**Example**
\`\`\`
Input: matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
Output: [[7, 4, 1], [8, 5, 2], [9, 6, 3]]
\`\`\``,
    functionName: "rotate",
    starterCode: `/**
 * @param {number[][]} matrix
 * @return {number[][]}
 */
function rotate(matrix) {
  // your code here
}`,
    solutionCode: `function rotate(matrix) {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  for (let i = 0; i < n; i++) {
    matrix[i].reverse();
  }
  return matrix;
}`,
    testCases: [
      {
        args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]],
        expected: [[7, 4, 1], [8, 5, 2], [9, 6, 3]],
      },
      { args: [[[1, 2], [3, 4]]], expected: [[3, 1], [4, 2]] },
    ],
    languages: {
      python: {
        functionName: "rotate",
        starterCode: `def rotate(matrix: list[list[int]]) -> list[list[int]]:
    # your code here
    pass`,
        solutionCode: `def rotate(matrix: list[list[int]]) -> list[list[int]]:
    n = len(matrix)
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    for row in matrix:
        row.reverse()
    return matrix`,
      },
    },
  },
  {
    id: "spiral-matrix",
    title: "Spiral Matrix",
    category: "matrix",
    difficulty: "medium",
    prompt: `Given an \`m x n\` matrix, return all of its elements in spiral order — right across the top, down the right edge, left across the bottom, up the left edge, then shrink inward and repeat.

Track four shrinking boundaries (\`top\`, \`bottom\`, \`left\`, \`right\`) and walk each edge in turn, moving the corresponding boundary inward after each edge.

**Example**
\`\`\`
Input: matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
Output: [1, 2, 3, 6, 9, 8, 7, 4, 5]
\`\`\``,
    functionName: "spiralOrder",
    starterCode: `/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
function spiralOrder(matrix) {
  // your code here
}`,
    solutionCode: `function spiralOrder(matrix) {
  const result = [];
  if (matrix.length === 0) return result;
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) result.push(matrix[top][c]);
    top++;
    for (let r = top; r <= bottom; r++) result.push(matrix[r][right]);
    right--;
    if (top <= bottom) {
      for (let c = right; c >= left; c--) result.push(matrix[bottom][c]);
      bottom--;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r--) result.push(matrix[r][left]);
      left++;
    }
  }
  return result;
}`,
    testCases: [
      {
        args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]],
        expected: [1, 2, 3, 6, 9, 8, 7, 4, 5],
      },
      {
        args: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]],
        expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7],
      },
    ],
    languages: {
      python: {
        functionName: "spiral_order",
        starterCode: `def spiral_order(matrix: list[list[int]]) -> list[int]:
    # your code here
    pass`,
        solutionCode: `def spiral_order(matrix: list[list[int]]) -> list[int]:
    result = []
    if not matrix:
        return result
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1

    while top <= bottom and left <= right:
        for c in range(left, right + 1):
            result.append(matrix[top][c])
        top += 1
        for r in range(top, bottom + 1):
            result.append(matrix[r][right])
        right -= 1
        if top <= bottom:
            for c in range(right, left - 1, -1):
                result.append(matrix[bottom][c])
            bottom -= 1
        if left <= right:
            for r in range(bottom, top - 1, -1):
                result.append(matrix[r][left])
            left += 1
    return result`,
      },
    },
  },
  {
    id: "set-matrix-zeroes",
    title: "Set Matrix Zeroes",
    category: "matrix",
    difficulty: "medium",
    prompt: `Given an \`m x n\` matrix, if an element is \`0\`, set its entire row and column to \`0\`. Do it in place and return the matrix.

Find every row and column that contains a zero first, then apply the zeroing in a second pass — mutating while you scan would zero out cells that should still be read as data.

**Example**
\`\`\`
Input: matrix = [[1, 1, 1], [1, 0, 1], [1, 1, 1]]
Output: [[1, 0, 1], [0, 0, 0], [1, 0, 1]]
\`\`\``,
    functionName: "setZeroes",
    starterCode: `/**
 * @param {number[][]} matrix
 * @return {number[][]}
 */
function setZeroes(matrix) {
  // your code here
}`,
    solutionCode: `function setZeroes(matrix) {
  const rows = matrix.length, cols = matrix[0].length;
  const zeroRows = new Set(), zeroCols = new Set();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (matrix[r][c] === 0) {
        zeroRows.add(r);
        zeroCols.add(c);
      }
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (zeroRows.has(r) || zeroCols.has(c)) matrix[r][c] = 0;
    }
  }
  return matrix;
}`,
    testCases: [
      {
        args: [[[1, 1, 1], [1, 0, 1], [1, 1, 1]]],
        expected: [[1, 0, 1], [0, 0, 0], [1, 0, 1]],
      },
      {
        args: [[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]],
        expected: [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]],
      },
    ],
    languages: {
      python: {
        functionName: "set_zeroes",
        starterCode: `def set_zeroes(matrix: list[list[int]]) -> list[list[int]]:
    # your code here
    pass`,
        solutionCode: `def set_zeroes(matrix: list[list[int]]) -> list[list[int]]:
    rows, cols = len(matrix), len(matrix[0])
    zero_rows, zero_cols = set(), set()
    for r in range(rows):
        for c in range(cols):
            if matrix[r][c] == 0:
                zero_rows.add(r)
                zero_cols.add(c)
    for r in range(rows):
        for c in range(cols):
            if r in zero_rows or c in zero_cols:
                matrix[r][c] = 0
    return matrix`,
      },
    },
  },
];
