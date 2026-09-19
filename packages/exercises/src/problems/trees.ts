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
    languages: {
      python: {
        functionName: "invert_tree",
        starterCode: `# root is a node with .val, .left, .right (or None)
def invert_tree(root):
    # your code here
    pass`,
        solutionCode: `def invert_tree(root):
    if root is None:
        return None
    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root`,
      },
    },
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
    languages: {
      python: {
        functionName: "is_valid_bst",
        starterCode: `# root is a node with .val, .left, .right (or None)
def is_valid_bst(root) -> bool:
    # your code here
    pass`,
        solutionCode: `def is_valid_bst(root, lo=float("-inf"), hi=float("inf")) -> bool:
    if root is None:
        return True
    if root.val <= lo or root.val >= hi:
        return False
    return is_valid_bst(root.left, lo, root.val) and is_valid_bst(root.right, root.val, hi)`,
      },
    },
  },
  {
    id: "same-tree",
    title: "Same Tree",
    category: "trees",
    difficulty: "easy",
    prompt: `Given the roots of two binary trees \`p\` and \`q\`, return \`true\` if they are structurally identical and every corresponding node holds the same value.

**Example**
\`\`\`
Input: p = [1, 2, 3], q = [1, 2, 3]
Output: true

Input: p = [1, 2], q = [1, null, 2]
Output: false
\`\`\``,
    functionName: "isSameTree",
    argTransform: "tree",
    starterCode: `/**
 * @param {TreeNode} p  // { val, left, right }
 * @param {TreeNode} q
 * @return {boolean}
 */
function isSameTree(p, q) {
  // your code here
}`,
    solutionCode: `function isSameTree(p, q) {
  if (!p && !q) return true;
  if (!p || !q) return false;
  return p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
    testCases: [
      { args: [[1, 2, 3], [1, 2, 3]], expected: true },
      { args: [[1, 2], [1, null, 2]], expected: false },
      { args: [[], []], expected: true },
    ],
    languages: {
      python: {
        functionName: "is_same_tree",
        starterCode: `# p and q are nodes with .val, .left, .right (or None)
def is_same_tree(p, q) -> bool:
    # your code here
    pass`,
        solutionCode: `def is_same_tree(p, q) -> bool:
    if p is None and q is None:
        return True
    if p is None or q is None:
        return False
    return p.val == q.val and is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)`,
      },
    },
  },
  {
    id: "diameter-of-binary-tree",
    title: "Diameter of Binary Tree",
    category: "trees",
    difficulty: "easy",
    prompt: `Given the root of a binary tree, return the length (in edges) of the longest path between any two nodes. The path doesn't need to pass through the root.

At every node, the longest path through it is the sum of its left and right subtree depths — track the best of those sums while computing depth anyway.

**Example**
\`\`\`
Input: root = [1, 2, 3, 4, 5]
Output: 3        // the path 4 → 2 → 1 → 3 (or 5 → 2 → 1 → 3)
\`\`\``,
    functionName: "diameterOfBinaryTree",
    argTransform: "tree",
    starterCode: `/**
 * @param {TreeNode} root  // { val, left, right }
 * @return {number}
 */
function diameterOfBinaryTree(root) {
  // your code here
}`,
    solutionCode: `function diameterOfBinaryTree(root) {
  let best = 0;
  function depth(node) {
    if (!node) return 0;
    const l = depth(node.left);
    const r = depth(node.right);
    best = Math.max(best, l + r);
    return 1 + Math.max(l, r);
  }
  depth(root);
  return best;
}`,
    testCases: [
      { args: [[1, 2, 3, 4, 5]], expected: 3 },
      { args: [[1, 2]], expected: 1 },
      { args: [[]], expected: 0 },
    ],
    languages: {
      python: {
        functionName: "diameter_of_binary_tree",
        starterCode: `# root is a node with .val, .left, .right (or None)
def diameter_of_binary_tree(root) -> int:
    # your code here
    pass`,
        solutionCode: `def diameter_of_binary_tree(root) -> int:
    best = 0

    def depth(node):
        nonlocal best
        if node is None:
            return 0
        l = depth(node.left)
        r = depth(node.right)
        best = max(best, l + r)
        return 1 + max(l, r)

    depth(root)
    return best`,
      },
    },
  },
  {
    id: "lowest-common-ancestor-bst",
    title: "Lowest Common Ancestor of a BST",
    category: "trees",
    difficulty: "medium",
    prompt: `Given the root of a binary search tree and two values \`p\` and \`q\` that exist in it, return the value of their lowest common ancestor — the deepest node that has both \`p\` and \`q\` in its subtree (a node can be its own descendant).

The BST property tells you which way to go without searching both sides: if both targets are smaller than the current node, the answer is in the left subtree; if both are larger, it's in the right; otherwise you've found the split point.

**Example**
\`\`\`
Input: root = [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p = 2, q = 8
Output: 6
\`\`\``,
    functionName: "lowestCommonAncestor",
    relatedAlgorithmId: "bst-search",
    argTransform: "tree",
    starterCode: `/**
 * @param {TreeNode} root  // { val, left, right }
 * @param {number} p
 * @param {number} q
 * @return {number}
 */
function lowestCommonAncestor(root, p, q) {
  // your code here
}`,
    solutionCode: `function lowestCommonAncestor(root, p, q) {
  let node = root;
  while (node) {
    if (p < node.val && q < node.val) node = node.left;
    else if (p > node.val && q > node.val) node = node.right;
    else return node.val;
  }
  return null;
}`,
    testCases: [
      { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 8], expected: 6 },
      { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 4], expected: 2 },
      { args: [[2, 1], 2, 1], expected: 2 },
    ],
    languages: {
      python: {
        functionName: "lowest_common_ancestor",
        starterCode: `# root is a node with .val, .left, .right (or None)
def lowest_common_ancestor(root, p: int, q: int) -> int:
    # your code here
    pass`,
        solutionCode: `def lowest_common_ancestor(root, p: int, q: int) -> int:
    node = root
    while node:
        if p < node.val and q < node.val:
            node = node.left
        elif p > node.val and q > node.val:
            node = node.right
        else:
            return node.val
    return None`,
      },
    },
  },
];
