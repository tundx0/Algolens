import type { TreeNodeRole, VisualizationStep } from "@algolens/viz-engine";
import type { AlgorithmDefinition } from "../definition";
import type { SearchInput } from "../searching/linear-search";
import { buildTree } from "./bst-utils";

const javascript = `function search(node, target) {
  if (node === null) return null;
  if (node.value === target) return node;
  return target < node.value
    ? search(node.left, target)
    : search(node.right, target);
}`;

const python = `def search(node, target):
    if node is None:
        return None
    if node.value == target:
        return node
    if target < node.value:
        return search(node.left, target)
    return search(node.right, target)`;

const java = `static Node search(Node node, int target) {
    if (node == null) return null;
    if (node.value == target) return node;
    return target < node.value
        ? search(node.left, target)
        : search(node.right, target);
}`;

function* generateSteps(input: SearchInput): Generator<VisualizationStep> {
  const tree = buildTree(input.values);
  const { target } = input;
  const roles: Record<number, TreeNodeRole> = {};

  yield {
    description: `Search for ${target}. At each node, go left if smaller, right if bigger — the sorted structure rules out half the remaining tree every step.`,
    state: tree.snapshot(),
  };

  let cur = tree.root;
  while (cur !== null) {
    const node = tree.nodes.get(cur)!;

    if (node.value === target) {
      roles[cur] = "found";
      yield {
        description: `${node.value} = ${target} — found.`,
        state: tree.snapshot({ ...roles }),
        codeLine: { javascript: 3, python: 4, java: 3 },
        metadata: { event: "complete" },
      };
      return;
    }

    roles[cur] = "compare";
    const goLeft = target < node.value;
    yield {
      description: `${target} ${goLeft ? "<" : ">"} ${node.value} — go ${goLeft ? "left" : "right"}.`,
      state: tree.snapshot({ ...roles }),
      codeLine: { javascript: 4, python: 6, java: 4 },
    };
    roles[cur] = "neutral";

    cur = goLeft ? node.left : node.right;
  }

  yield {
    description: `${target} is not in the tree.`,
    state: tree.snapshot({ ...roles }),
    metadata: { event: "complete" },
  };
}

export const bstSearch: AlgorithmDefinition<SearchInput> = {
  id: "bst-search",
  name: "BST search",
  category: "tree",
  difficulty: "beginner",
  timeComplexity: { best: "O(log n)", average: "O(log n)", worst: "O(n)" },
  spaceComplexity: "O(1)",
  defaultInput: { values: [8, 3, 10, 1, 6, 14, 4, 7, 13], target: 7 },
  generateSteps,
  codeImplementations: { javascript, python, java },
};
