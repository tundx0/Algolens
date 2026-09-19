import type { ExerciseDefinition } from "../types";

export const bitManipulation: ExerciseDefinition[] = [
  {
    id: "single-number",
    title: "Single Number",
    category: "bit-manipulation",
    difficulty: "easy",
    prompt: `Given a non-empty array \`nums\` where every element appears exactly twice except for one, find that single element — in O(n) time and O(1) extra space.

Hint: XOR-ing a number with itself gives \`0\`, and XOR is commutative — the duplicates cancel out.

**Example**
\`\`\`
Input: nums = [4, 1, 2, 1, 2]
Output: 4
\`\`\``,
    functionName: "singleNumber",
    starterCode: `/**
 * @param {number[]} nums
 * @return {number}
 */
function singleNumber(nums) {
  // your code here
}`,
    solutionCode: `function singleNumber(nums) {
  return nums.reduce((acc, n) => acc ^ n, 0);
}`,
    testCases: [
      { args: [[2, 2, 1]], expected: 1 },
      { args: [[4, 1, 2, 1, 2]], expected: 4 },
      { args: [[1]], expected: 1 },
    ],
    languages: {
      python: {
        functionName: "single_number",
        starterCode: `def single_number(nums: list[int]) -> int:
    # your code here
    pass`,
        solutionCode: `def single_number(nums: list[int]) -> int:
    result = 0
    for n in nums:
        result ^= n
    return result`,
      },
    },
  },
  {
    id: "number-of-1-bits",
    title: "Number of 1 Bits",
    category: "bit-manipulation",
    difficulty: "easy",
    prompt: `Given an unsigned integer \`n\`, return the number of \`1\` bits in its binary representation (the Hamming weight).

**Example**
\`\`\`
Input: n = 11        // binary 1011
Output: 3
\`\`\``,
    functionName: "hammingWeight",
    starterCode: `/**
 * @param {number} n
 * @return {number}
 */
function hammingWeight(n) {
  // your code here
}`,
    solutionCode: `function hammingWeight(n) {
  let count = 0;
  while (n !== 0) {
    count += n & 1;
    n >>>= 1;
  }
  return count;
}`,
    testCases: [
      { args: [11], expected: 3 },
      { args: [128], expected: 1 },
      { args: [0], expected: 0 },
      { args: [4294967293], expected: 31 },
    ],
    languages: {
      python: {
        functionName: "hamming_weight",
        starterCode: `def hamming_weight(n: int) -> int:
    # your code here
    pass`,
        solutionCode: `def hamming_weight(n: int) -> int:
    count = 0
    while n != 0:
        count += n & 1
        n >>= 1
    return count`,
      },
    },
  },
  {
    id: "counting-bits",
    title: "Counting Bits",
    category: "bit-manipulation",
    difficulty: "easy",
    prompt: `Given an integer \`n\`, return an array \`ans\` of length \`n + 1\` where \`ans[i]\` is the number of \`1\` bits in the binary representation of \`i\`, for every \`i\` from \`0\` to \`n\`.

Try to do it with a single O(n) pass using previously computed answers, rather than recomputing each one from scratch.

**Example**
\`\`\`
Input: n = 5
Output: [0, 1, 1, 2, 1, 2]        // 0,1,1,10,1,10 in binary
\`\`\``,
    functionName: "countBits",
    starterCode: `/**
 * @param {number} n
 * @return {number[]}
 */
function countBits(n) {
  // your code here
}`,
    solutionCode: `function countBits(n) {
  const ans = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    ans[i] = ans[i >> 1] + (i & 1);
  }
  return ans;
}`,
    testCases: [
      { args: [2], expected: [0, 1, 1] },
      { args: [5], expected: [0, 1, 1, 2, 1, 2] },
      { args: [0], expected: [0] },
    ],
    languages: {
      python: {
        functionName: "count_bits",
        starterCode: `def count_bits(n: int) -> list[int]:
    # your code here
    pass`,
        solutionCode: `def count_bits(n: int) -> list[int]:
    ans = [0] * (n + 1)
    for i in range(1, n + 1):
        ans[i] = ans[i >> 1] + (i & 1)
    return ans`,
      },
    },
  },
  {
    id: "reverse-bits",
    title: "Reverse Bits",
    category: "bit-manipulation",
    difficulty: "medium",
    prompt: `Given a 32-bit unsigned integer \`n\`, return the integer obtained by reversing the bits of its binary representation.

Peel one bit off the low end of \`n\` and place it at the low end of a growing result, shifting the result left each time — after 32 rounds, the result holds \`n\`'s bits in reverse order.

**Example**
\`\`\`
Input: n = 43261596        // 00000010100101000001111010011100
Output: 964176192          // 00111001011110000010100101000000
\`\`\``,
    functionName: "reverseBits",
    starterCode: `/**
 * @param {number} n
 * @return {number}
 */
function reverseBits(n) {
  // your code here
}`,
    solutionCode: `function reverseBits(n) {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = (result << 1) | (n & 1);
    n >>>= 1;
  }
  return result >>> 0;
}`,
    testCases: [
      { args: [43261596], expected: 964176192 },
      { args: [0], expected: 0 },
      { args: [1], expected: 2147483648 },
    ],
    languages: {
      python: {
        functionName: "reverse_bits",
        starterCode: `def reverse_bits(n: int) -> int:
    # your code here
    pass`,
        solutionCode: `def reverse_bits(n: int) -> int:
    result = 0
    for _ in range(32):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result`,
      },
    },
  },
];
