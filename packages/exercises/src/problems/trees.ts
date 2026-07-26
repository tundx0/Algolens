import type { ExerciseDefinition } from "../types";

export const trees: ExerciseDefinition[] = [
  {
    id: "maximum-depth-binary-tree",
    title: "Maximum Depth of Binary Tree",
    category: "trees",
    difficulty: "easy",
    prompt: `Given the root of a binary tree, return its maximum depth — the number of nodes along the longest path from root to a leaf.

Trees are shown below as level-order arrays with \`null\` for missing children (e.g. \`[3, 9, 20, null, null, 15, 7]\`); AlgoLens builds the real \`{ val, left, right }\` node structure before your function runs.

**Example**
\`\`\`
Input: root = [3, 9, 20, null, null, 15, 7]
Output: 3
\`\`\``,
    functionName: "maxDepth",
    argTransform: "tree",
    starterCode: `/**
 * @param {TreeNode} root  // { val, left, right }
 * @return {number}
 */
function maxDepth(root) {
  // your code here
}`,
    solutionCode: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    testCases: [
      { args: [[3, 9, 20, null, null, 15, 7]], expected: 3 },
      { args: [[1, null, 2]], expected: 2 },
      { args: [[]], expected: 0 },
    ],
    languages: {
      python: {
        functionName: "max_depth",
        starterCode: `# root is a node with .val, .left, .right (or None)
def max_depth(root) -> int:
    # your code here
    pass`,
        solutionCode: `def max_depth(root) -> int:
    if root is None:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
      },
    },
  },
  {
    id: "invert-binary-tree",
    title: "Invert Binary Tree",
    category: "trees",
    difficulty: "easy",
    prompt: `Given the root of a binary tree, invert it — every left child becomes a right child and vice versa, all the way down — and return the new root.

**Example**
\`\`\`
Input: root = [4, 2, 7, 1, 3, 6, 9]
Output: [4, 7, 2, 9, 6, 3, 1]
\`\`\``,
    functionName: "invertTree",
    argTransform: "tree",
    resultTransform: "tree",
    starterCode: `/**
 * @param {TreeNode} root  // { val, left, right }
 * @return {TreeNode}
 */
function invertTree(root) {
  // your code here
}`,
    solutionCode: `function invertTree(root) {
  if (!root) return null;
  [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];
  return root;
}`,
    testCases: [
      {
        args: [[4, 2, 7, 1, 3, 6, 9]],
        expected: [4, 7, 2, 9, 6, 3, 1],
      },
      { args: [[2, 1, 3]], expected: [2, 3, 1] },
      { args: [[]], expected: [] },
    ],
  },
  {
    id: "validate-binary-search-tree",
    title: "Validate Binary Search Tree",
    category: "trees",
    difficulty: "medium",
    prompt: `Given the root of a binary tree, determine whether it is a valid binary search tree: every node's value must be strictly greater than all values in its left subtree and strictly less than all values in its right subtree.

Pairs well with the [BST insert visualization](/visualize?algo=bst-insert) — this problem asks you to verify the invariant that visualization builds.

**Example**
\`\`\`
Input: root = [5, 1, 4, null, null, 3, 6]
Output: false        // 4's left subtree contains 3, but 4 is the right child of 5's... actually 3 < 4 is fine; the violation is that 4 < 5 but sits in 5's right subtree.
\`\`\``,
    functionName: "isValidBST",
    relatedAlgorithmId: "bst-insert",
    argTransform: "tree",
    starterCode: `/**
 * @param {TreeNode} root  // { val, left, right }
 * @return {boolean}
 */
function isValidBST(root) {
  // your code here
}`,
    solutionCode: `function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;
  if (root.val <= min || root.val >= max) return false;
  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);
}`,
    testCases: [
      { args: [[2, 1, 3]], expected: true },
      { args: [[5, 1, 4, null, null, 3, 6]], expected: false },
      { args: [[]], expected: true },
      { args: [[1]], expected: true },
    ],
  },
];
