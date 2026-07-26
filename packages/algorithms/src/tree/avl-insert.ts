import type { TreeNode, TreeNodeRole, VisualizationStep } from "@algolens/viz-engine";
import type { AlgorithmDefinition } from "../definition";
import { MutableTree } from "./bst-utils";

const javascript = `function insert(node, value) {
  if (node === null) return makeNode(value);
  if (value < node.value) node.left = insert(node.left, value);
  else node.right = insert(node.right, value);

  node.height = 1 + Math.max(height(node.left), height(node.right));
  const balance = height(node.left) - height(node.right);

  if (balance > 1 && value < node.left.value) return rotateRight(node);
  if (balance < -1 && value > node.right.value) return rotateLeft(node);
  if (balance > 1 && value > node.left.value) {
    node.left = rotateLeft(node.left);
    return rotateRight(node);
  }
  if (balance < -1 && value < node.right.value) {
    node.right = rotateRight(node.right);
    return rotateLeft(node);
  }
  return node;
}`;

const python = `def insert(node, value):
    if node is None:
        return Node(value)
    if value < node.value:
        node.left = insert(node.left, value)
    else:
        node.right = insert(node.right, value)

    node.height = 1 + max(height(node.left), height(node.right))
    balance = height(node.left) - height(node.right)

    if balance > 1 and value < node.left.value:
        return rotate_right(node)
    if balance < -1 and value > node.right.value:
        return rotate_left(node)
    if balance > 1 and value > node.left.value:
        node.left = rotate_left(node.left)
        return rotate_right(node)
    if balance < -1 and value < node.right.value:
        node.right = rotate_right(node.right)
        return rotate_left(node)
    return node`;

const java = `static Node insert(Node node, int value) {
    if (node == null) return new Node(value);
    if (value < node.value) node.left = insert(node.left, value);
    else node.right = insert(node.right, value);

    node.height = 1 + Math.max(height(node.left), height(node.right));
    int balance = height(node.left) - height(node.right);

    if (balance > 1 && value < node.left.value) return rotateRight(node);
    if (balance < -1 && value > node.right.value) return rotateLeft(node);
    if (balance > 1 && value > node.left.value) {
        node.left = rotateLeft(node.left);
        return rotateRight(node);
    }
    if (balance < -1 && value < node.right.value) {
        node.right = rotateRight(node.right);
        return rotateLeft(node);
    }
    return node;
}`;

function* generateSteps(values: number[]): Generator<VisualizationStep> {
  const tree = new MutableTree();
  let nextId = 0;
  const newId = () => nextId++;

  const heightOf = (id: number | null): number =>
    id === null ? -1 : (tree.nodes.get(id)?.height ?? 0);

  function updateHeight(id: number) {
    const node = tree.nodes.get(id) as TreeNode;
    node.height = 1 + Math.max(heightOf(node.left), heightOf(node.right));
  }

  function balance(id: number): number {
    const node = tree.nodes.get(id) as TreeNode;
    return heightOf(node.left) - heightOf(node.right);
  }

  function rotateLeft(x: number): number {
    const xNode = tree.nodes.get(x) as TreeNode;
    const y = xNode.right as number;
    const yNode = tree.nodes.get(y) as TreeNode;
    xNode.right = yNode.left;
    yNode.left = x;
    updateHeight(x);
    updateHeight(y);
    return y;
  }

  function rotateRight(x: number): number {
    const xNode = tree.nodes.get(x) as TreeNode;
    const y = xNode.left as number;
    const yNode = tree.nodes.get(y) as TreeNode;
    xNode.left = yNode.right;
    yNode.right = x;
    updateHeight(x);
    updateHeight(y);
    return y;
  }

  function* insert(id: number | null, value: number): Generator<VisualizationStep, number> {
    if (id === null) {
      const created = newId();
      tree.nodes.set(created, { id: created, value, left: null, right: null, height: 0 });
      if (tree.root === null) tree.root = created;
      yield {
        description: `Place ${value} here.`,
        state: tree.snapshot({ [created]: "inserted" }),
      };
      return created;
    }

    const node = tree.nodes.get(id) as TreeNode;
    const goLeft = value < node.value;
    yield {
      description: `Compare ${value} with ${node.value}: go ${goLeft ? "left" : "right"}.`,
      state: tree.snapshot({ [id]: "compare" }),
      codeLine: { javascript: 3, python: 4, java: 3 },
    };

    if (goLeft) {
      node.left = yield* insert(node.left, value);
    } else {
      node.right = yield* insert(node.right, value);
    }
    updateHeight(id);
    const bf = balance(id);

    if (Math.abs(bf) > 1) {
      const roles: Record<number, TreeNodeRole> = { [id]: "rotating" };
      const childId = bf > 1 ? (node.left as number) : (node.right as number);
      roles[childId] = "rotating";
      yield {
        description: `Unbalanced at ${node.value} (balance ${bf}) — rotate to restore AVL balance.`,
        state: tree.snapshot(roles),
        codeLine: { javascript: 9, python: 12, java: 9 },
        metadata: { event: "swap" },
      };

      let newRoot: number;
      if (bf > 1 && value < (tree.nodes.get(node.left as number) as TreeNode).value) {
        newRoot = rotateRight(id);
      } else if (bf < -1 && value > (tree.nodes.get(node.right as number) as TreeNode).value) {
        newRoot = rotateLeft(id);
      } else if (bf > 1) {
        node.left = rotateLeft(node.left as number);
        newRoot = rotateRight(id);
      } else {
        node.right = rotateRight(node.right as number);
        newRoot = rotateLeft(id);
      }

      if (id === tree.root) tree.root = newRoot;
      yield {
        description: "Rebalanced.",
        state: tree.snapshot({ [newRoot]: "rotating" }),
        metadata: { event: "pass-end" },
      };
      return newRoot;
    }

    return id;
  }

  yield {
    description: `Insert ${values.length} values into an AVL tree — after every insertion, rotations restore the balance invariant so height always stays O(log n).`,
    state: tree.snapshot(),
  };

  for (const value of values) {
    tree.root = yield* insert(tree.root, value);
    yield {
      description: `${value} inserted — tree remains balanced.`,
      state: tree.snapshot(),
      metadata: { event: "pass-end" },
    };
  }

  yield {
    description: "Done — every value inserted, tree is height-balanced throughout.",
    state: tree.snapshot(),
    metadata: { event: "complete" },
  };
}

export const avlInsert: AlgorithmDefinition<number[]> = {
  id: "avl-insert",
  name: "AVL insert (rotations)",
  category: "tree",
  difficulty: "advanced",
  timeComplexity: { best: "O(log n)", average: "O(log n)", worst: "O(log n)" },
  spaceComplexity: "O(n)",
  defaultInput: [1, 2, 3, 4, 5, 6, 7],
  generateSteps,
  codeImplementations: { javascript, python, java },
};
