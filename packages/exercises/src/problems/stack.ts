import type { ExerciseDefinition } from "../types";

export const stack: ExerciseDefinition[] = [
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    category: "stack",
    difficulty: "easy",
    prompt: `Given a string \`s\` containing only the characters \`(\`, \`)\`, \`{\`, \`}\`, \`[\`, \`]\`, determine whether every bracket is closed in the correct order.

**Example**
\`\`\`
Input: s = "()[]{}"
Output: true

Input: s = "(]"
Output: false
\`\`\``,
    functionName: "isValid",
    starterCode: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // your code here
}`,
    solutionCode: `function isValid(s) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}`,
    testCases: [
      { args: ["()"], expected: true },
      { args: ["()[]{}"], expected: true },
      { args: ["(]"], expected: false },
      { args: ["([)]"], expected: false },
      { args: ["{[]}"], expected: true },
    ],
    languages: {
      python: {
        functionName: "is_valid",
        starterCode: `def is_valid(s: str) -> bool:
    # your code here
    pass`,
        solutionCode: `def is_valid(s: str) -> bool:
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        else:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return len(stack) == 0`,
      },
    },
  },
  {
    id: "daily-temperatures",
    title: "Daily Temperatures",
    category: "stack",
    difficulty: "medium",
    prompt: `Given an array \`temperatures\`, return an array \`answer\` where \`answer[i]\` is the number of days you'd have to wait after day \`i\` for a warmer temperature. If there's no future day like that, put \`0\`.

**Example**
\`\`\`
Input: temperatures = [73, 74, 75, 71, 69, 72, 76, 73]
Output: [1, 1, 4, 2, 1, 1, 0, 0]
\`\`\``,
    functionName: "dailyTemperatures",
    starterCode: `/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
function dailyTemperatures(temperatures) {
  // your code here
}`,
    solutionCode: `function dailyTemperatures(temperatures) {
  const answer = new Array(temperatures.length).fill(0);
  const stack = []; // indices with unresolved "warmer day"
  for (let i = 0; i < temperatures.length; i++) {
    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const j = stack.pop();
      answer[j] = i - j;
    }
    stack.push(i);
  }
  return answer;
}`,
    testCases: [
      {
        args: [[73, 74, 75, 71, 69, 72, 76, 73]],
        expected: [1, 1, 4, 2, 1, 1, 0, 0],
      },
      { args: [[30, 40, 50, 60]], expected: [1, 1, 1, 0] },
      { args: [[30, 60, 90]], expected: [1, 1, 0] },
    ],
  },
];
