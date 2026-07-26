import type { TreeNodeRole, VisualizationStep } from "@algolens/viz-engine";
import type { AlgorithmDefinition } from "../definition";
import { MutableTree } from "./bst-utils";

const javascript = `function insert(node, value) {
  if (node === null) return { value, left: null, right: null };
  if (value < node.value) node.left = insert(node.left, value);
  else node.right = insert(node.right, value);
  return node;
}`;

const python = `def insert(node, value):
    if node is None:
        return Node(value)
    if value < node.value:
        node.left = insert(node.left, value)
    else:
        node.right = insert(node.right, value)
    return node`;

const java = `static Node insert(Node node, int value) {
    if (node == null) return new Node(value);
    if (value < node.value) node.left = insert(node.left, value);
    else node.right = insert(node.right, value);
    return node;
}`;

function* generateSteps(values: number[]): Generator<VisualizationStep> {
  const tree = new MutableTree();

  yield {
    description: `Insert ${values.length} values one at a time. Each value walks down from the root — left if smaller, right if not — until it finds an empty spot.`,
    state: tree.snapshot(),
  };

  for (const value of values) {
    if (tree.root === null) {
      const id = tree.insert(value);
      yield {
        description: `Tree is empty — ${value} becomes the root.`,
        state: tree.snapshot({ [id]: "inserted" }),
        codeLine: { javascript: 2, python: 2, java: 2 },
        metadata: { event: "pass-end" },
      };
      continue;
    }

    let cur = tree.root;
    const roles: Record<number, TreeNodeRole> = {};
    for (;;) {
      const node = tree.nodes.get(cur)!;
      roles[cur] = "compare";
      yield {
        description: `Compare ${value} with ${node.value}: go ${value < node.value ? "left" : "right"}.`,
        state: tree.snapshot({ ...roles }),
        codeLine: { javascript: 3, python: 4, java: 3 },
      };
      roles[cur] = "neutral";

      const next = value < node.value ? node.left : node.right;
      if (next === null) break;
      cur = next;
    }

    const id = tree.insert(value);
    yield {
      description: `Found the empty spot — insert ${value}.`,
      state: tree.snapshot({ ...roles, [id]: "inserted" }),
      codeLine: { javascript: 2, python: 2, java: 2 },
      metadata: { event: "pass-end" },
    };
  }

  yield {
    description: "Done — every value has been inserted.",
    state: tree.snapshot(),
    metadata: { event: "complete" },
  };
}

export const bstInsert: AlgorithmDefinition<number[]> = {
  id: "bst-insert",
  name: "BST insert",
  category: "tree",
  difficulty: "beginner",
  timeComplexity: { best: "O(log n)", average: "O(log n)", worst: "O(n)" },
  spaceComplexity: "O(n)",
  defaultInput: [8, 3, 10, 1, 6, 14, 4, 7, 13],
  generateSteps,
  codeImplementations: { javascript, python, java },
};
