import type { TreeNode, TreeNodeRole, TreeState } from "@algolens/viz-engine";

export class MutableTree {
  nodes = new Map<number, TreeNode>();
  root: number | null = null;
  private nextId = 0;

  insert(value: number): number {
    const id = this.nextId++;
    this.nodes.set(id, { id, value, left: null, right: null });
    if (this.root === null) {
      this.root = id;
      return id;
    }
    let cur = this.root;
    for (;;) {
      const node = this.nodes.get(cur) as TreeNode;
      if (value < node.value) {
        if (node.left === null) {
          node.left = id;
          return id;
        }
        cur = node.left;
      } else {
        if (node.right === null) {
          node.right = id;
          return id;
        }
        cur = node.right;
      }
    }
  }

  snapshot(roles?: Record<number, TreeNodeRole>, visitedOrder?: number[]): TreeState {
    return {
      kind: "tree",
      nodes: [...this.nodes.values()].map((n) => ({ ...n })),
      root: this.root,
      roles,
      visitedOrder,
    };
  }
}

export function buildTree(values: number[]): MutableTree {
  const tree = new MutableTree();
  for (const v of values) tree.insert(v);
  return tree;
}

export function height(tree: MutableTree, id: number | null): number {
  if (id === null) return -1;
  const node = tree.nodes.get(id);
  if (!node) return -1;
  return 1 + Math.max(height(tree, node.left), height(tree, node.right));
}

export function balanceFactor(tree: MutableTree, id: number): number {
  const node = tree.nodes.get(id) as TreeNode;
  return height(tree, node.left) - height(tree, node.right);
}
