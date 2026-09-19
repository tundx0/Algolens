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
    languages: {
      python: {
        functionName: "daily_temperatures",
        starterCode: `def daily_temperatures(temperatures: list[int]) -> list[int]:
    # your code here
    pass`,
        solutionCode: `def daily_temperatures(temperatures: list[int]) -> list[int]:
    answer = [0] * len(temperatures)
    stack = []
    for i, t in enumerate(temperatures):
        while stack and t > temperatures[stack[-1]]:
            j = stack.pop()
            answer[j] = i - j
        stack.append(i)
    return answer`,
      },
    },
  },
  {
    id: "evaluate-reverse-polish-notation",
    title: "Evaluate Reverse Polish Notation",
    category: "stack",
    difficulty: "medium",
    prompt: `Evaluate an arithmetic expression given in Reverse Polish Notation, as an array of string \`tokens\`. Operands can be integers, operators are \`+\`, \`-\`, \`*\`, \`/\` — division truncates toward zero. Return the result.

**Example**
\`\`\`
Input: tokens = ["2", "1", "+", "3", "*"]
Output: 9        // (2 + 1) * 3
\`\`\``,
    functionName: "evalRPN",
    starterCode: `/**
 * @param {string[]} tokens
 * @return {number}
 */
function evalRPN(tokens) {
  // your code here
}`,
    solutionCode: `function evalRPN(tokens) {
  const stack = [];
  const ops = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => Math.trunc(a / b),
  };
  for (const tok of tokens) {
    if (tok in ops) {
      const b = stack.pop();
      const a = stack.pop();
      stack.push(ops[tok](a, b));
    } else {
      stack.push(Number(tok));
    }
  }
  return stack[0];
}`,
    testCases: [
      { args: [["2", "1", "+", "3", "*"]], expected: 9 },
      { args: [["4", "13", "5", "/", "+"]], expected: 6 },
      { args: [["18"]], expected: 18 },
    ],
    languages: {
      python: {
        functionName: "eval_rpn",
        starterCode: `def eval_rpn(tokens: list[str]) -> int:
    # your code here
    pass`,
        solutionCode: `def eval_rpn(tokens: list[str]) -> int:
    stack = []
    ops = {
        "+": lambda a, b: a + b,
        "-": lambda a, b: a - b,
        "*": lambda a, b: a * b,
        "/": lambda a, b: int(a / b),
    }
    for tok in tokens:
        if tok in ops:
            b = stack.pop()
            a = stack.pop()
            stack.append(ops[tok](a, b))
        else:
            stack.append(int(tok))
    return stack[0]`,
      },
    },
  },
  {
    id: "asteroid-collision",
    title: "Asteroid Collision",
    category: "stack",
    difficulty: "medium",
    prompt: `Given an array \`asteroids\` where each value's sign gives its direction (positive = right, negative = left) and its magnitude gives its size, simulate all collisions: when two meet, the smaller explodes; equal sizes both explode. Asteroids moving the same direction never meet. Return the state after all collisions settle.

A stack works because only the most recently surviving right-mover can ever meet the next left-mover.

**Example**
\`\`\`
Input: asteroids = [5, 10, -5]
Output: [5, 10]        // -5 hits 10, 10 survives, -5 is destroyed
\`\`\``,
    functionName: "asteroidCollision",
    starterCode: `/**
 * @param {number[]} asteroids
 * @return {number[]}
 */
function asteroidCollision(asteroids) {
  // your code here
}`,
    solutionCode: `function asteroidCollision(asteroids) {
  const stack = [];
  for (const a of asteroids) {
    let alive = true;
    while (alive && a < 0 && stack.length && stack[stack.length - 1] > 0) {
      const top = stack[stack.length - 1];
      if (top < -a) {
        stack.pop();
        continue;
      } else if (top === -a) {
        stack.pop();
        alive = false;
      } else {
        alive = false;
      }
    }
    if (alive) stack.push(a);
  }
  return stack;
}`,
    testCases: [
      { args: [[5, 10, -5]], expected: [5, 10] },
      { args: [[8, -8]], expected: [] },
      { args: [[10, 2, -5]], expected: [10] },
    ],
    languages: {
      python: {
        functionName: "asteroid_collision",
        starterCode: `def asteroid_collision(asteroids: list[int]) -> list[int]:
    # your code here
    pass`,
        solutionCode: `def asteroid_collision(asteroids: list[int]) -> list[int]:
    stack = []
    for a in asteroids:
        alive = True
        while alive and a < 0 and stack and stack[-1] > 0:
            top = stack[-1]
            if top < -a:
                stack.pop()
                continue
            elif top == -a:
                stack.pop()
                alive = False
            else:
                alive = False
        if alive:
            stack.append(a)
    return stack`,
      },
    },
  },
];
