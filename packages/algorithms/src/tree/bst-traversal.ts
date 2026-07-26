import type { TreeNodeRole, VisualizationStep } from "@algolens/viz-engine";
import type { AlgorithmDefinition } from "../definition";
import { buildTree } from "./bst-utils";

const javascript = `function inorder(node, out = []) {
  if (node === null) return out;
  inorder(node.left, out);
  out.push(node.value);
  inorder(node.right, out);
  return out;
}`;

const python = `def inorder(node, out=None):
    if out is None:
        out = []
    if node is None:
        return out
    inorder(node.left, out)
    out.append(node.value)
    inorder(node.right, out)
    return out`;

const java = `static void inorder(Node node, List<Integer> out) {
    if (node == null) return;
    inorder(node.left, out);
    out.add(node.value);
    inorder(node.right, out);
}`;

function* generateSteps(values: number[]): Generator<VisualizationStep> {
  const tree = buildTree(values);
  const roles: Record<number, TreeNodeRole> = {};
  const order: number[] = [];

  yield {
    description:
      "In-order traversal visits left subtree, then the node itself, then right subtree — for a BST this always visits values in ascending order.",
    state: tree.snapshot(),
  };

  function* walk(id: number | null): Generator<VisualizationStep> {
    if (id === null) return;
    const node = tree.nodes.get(id)!;

    yield* walk(node.left);

    roles[id] = "compare";
    order.push(node.value);
    yield {
      description: `Visit ${node.value}.`,
      state: tree.snapshot({ ...roles }, [...order]),
      codeLine: { javascript: 4, python: 8, java: 4 },
    };
    roles[id] = "found";

    yield* walk(node.right);
  }

  yield* walk(tree.root);

  yield {
    description: `Done — visited in order: ${order.join(", ")}.`,
    state: tree.snapshot({ ...roles }, order),
    metadata: { event: "complete" },
  };
}

export const bstTraversal: AlgorithmDefinition<number[]> = {
  id: "bst-traversal",
  name: "BST in-order traversal",
  category: "tree",
  difficulty: "beginner",
  timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
  spaceComplexity: "O(h)",
  defaultInput: [8, 3, 10, 1, 6, 14, 4, 7, 13],
  generateSteps,
  codeImplementations: { javascript, python, java },
};
