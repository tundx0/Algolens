import type { TreeNodeRole, VisualizationStep } from "@algolens/viz-engine";
import type { AlgorithmDefinition } from "../definition";
import type { SearchInput } from "../searching/linear-search";
import { buildTree } from "./bst-utils";

const javascript = `function remove(node, value) {
  if (node === null) return null;
  if (value < node.value) node.left = remove(node.left, value);
  else if (value > node.value) node.right = remove(node.right, value);
  else {
    if (node.left === null) return node.right;
    if (node.right === null) return node.left;
    let successor = node.right;
    while (successor.left !== null) successor = successor.left;
    node.value = successor.value;
    node.right = remove(node.right, successor.value);
  }
  return node;
}`;

const python = `def remove(node, value):
    if node is None:
        return None
    if value < node.value:
        node.left = remove(node.left, value)
    elif value > node.value:
        node.right = remove(node.right, value)
    else:
        if node.left is None:
            return node.right
        if node.right is None:
            return node.left
        successor = node.right
        while successor.left is not None:
            successor = successor.left
        node.value = successor.value
        node.right = remove(node.right, successor.value)
    return node`;

const java = `static Node remove(Node node, int value) {
    if (node == null) return null;
    if (value < node.value) node.left = remove(node.left, value);
    else if (value > node.value) node.right = remove(node.right, value);
    else {
        if (node.left == null) return node.right;
        if (node.right == null) return node.left;
        Node successor = node.right;
        while (successor.left != null) successor = successor.left;
        node.value = successor.value;
        node.right = remove(node.right, successor.value);
    }
    return node;
}`;

function* generateSteps(input: SearchInput): Generator<VisualizationStep> {
  const tree = buildTree(input.values);
  const target = input.target;
  const roles: Record<number, TreeNodeRole> = {};

  yield {
    description: `Delete ${target}. First walk down to find it, same as a search.`,
    state: tree.snapshot(),
  };

  let parent: number | null = null;
  let cur = tree.root;
  while (cur !== null) {
    const node = tree.nodes.get(cur)!;
    if (node.value === target) break;
    roles[cur] = "compare";
    const goLeft = target < node.value;
    yield {
      description: `${target} ${goLeft ? "<" : ">"} ${node.value} — go ${goLeft ? "left" : "right"}.`,
      state: tree.snapshot({ ...roles }),
      codeLine: { javascript: 3, python: 4, java: 3 },
    };
    roles[cur] = "neutral";
    parent = cur;
    cur = goLeft ? node.left : node.right;
  }

  if (cur === null) {
    yield {
      description: `${target} is not in the tree — nothing to delete.`,
      state: tree.snapshot({ ...roles }),
      metadata: { event: "complete" },
    };
    return;
  }

  function attach(parentId: number | null, oldChild: number, newChild: number | null) {
    if (parentId === null) {
      tree.root = newChild;
      return;
    }
    const p = tree.nodes.get(parentId)!;
    if (p.left === oldChild) p.left = newChild;
    else p.right = newChild;
  }

  const node = tree.nodes.get(cur)!;

  if (node.left === null || node.right === null) {
    const child = node.left ?? node.right;
    roles[cur] = "deleted";
    yield {
      description: `${target} has ${node.left === null && node.right === null ? "no children" : "one child"} — remove it directly.`,
      state: tree.snapshot({ ...roles }),
      codeLine: { javascript: node.left === null ? 6 : 7, python: 9, java: 9 },
      metadata: { event: "swap" },
    };
    delete roles[cur];
    attach(parent, cur, child);
    tree.nodes.delete(cur);
  } else {
    roles[cur] = "compare";
    yield {
      description: `${target} has two children — find its in-order successor (smallest value in the right subtree).`,
      state: tree.snapshot({ ...roles }),
      codeLine: { javascript: 10, python: 15, java: 12 },
    };

    let succParent = cur;
    let succ = node.right;
    while (true) {
      const succNode = tree.nodes.get(succ)!;
      roles[succ] = "compare";
      yield {
        description: `Walk left to ${succNode.value}.`,
        state: tree.snapshot({ ...roles }),
        codeLine: { javascript: 11, python: 16, java: 13 },
      };
      if (succNode.left === null) break;
      roles[succ] = "neutral";
      succParent = succ;
      succ = succNode.left;
    }

    const succNode = tree.nodes.get(succ)!;
    const succValue = succNode.value;
    roles[succ] = "deleted";
    roles[cur] = "inserted";
    node.value = succValue;
    yield {
      description: `Copy successor value ${succValue} into the deleted node, then remove the now-duplicate successor.`,
      state: tree.snapshot({ ...roles }),
      codeLine: { javascript: 13, python: 18, java: 15 },
      metadata: { event: "swap" },
    };

    delete roles[succ];
    delete roles[cur];
    attach(succParent, succ, succNode.right);
    tree.nodes.delete(succ);
  }

  yield {
    description: `Done — ${target} has been removed.`,
    state: tree.snapshot(),
    metadata: { event: "complete" },
  };
}

export const bstDelete: AlgorithmDefinition<SearchInput> = {
  id: "bst-delete",
  name: "BST delete",
  category: "tree",
  difficulty: "intermediate",
  timeComplexity: { best: "O(log n)", average: "O(log n)", worst: "O(n)" },
  spaceComplexity: "O(1)",
  defaultInput: { values: [8, 3, 10, 1, 6, 14, 4, 7, 13], target: 3 },
  generateSteps,
  codeImplementations: { javascript, python, java },
};
