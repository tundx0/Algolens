import type { TreeState } from "../types";

export interface PositionedNode {
  id: number;
  value: number;
  x: number;
  y: number;
  left: number | null;
  right: number | null;
}

export interface TreeLayoutOptions {
  width: number;
  height: number;
  nodeRadius?: number;
}

/**
 * Pure geometry, no D3 dependency needed for a plain binary tree: x comes
 * from in-order rank (so left always draws left of right, no crossed edges),
 * y comes from depth. Same shape as array/grid layout — one function, both
 * the SVG renderer and any future export consume it identically.
 */
export function layoutTree(
  state: Pick<TreeState, "nodes" | "root">,
  { width, height, nodeRadius = 22 }: TreeLayoutOptions,
): PositionedNode[] {
  if (state.root === null || state.nodes.length === 0) return [];

  const byId = new Map(state.nodes.map((n) => [n.id, n]));
  const rank = new Map<number, number>();
  const depth = new Map<number, number>();
  let counter = 0;
  let maxDepth = 0;

  function visit(id: number | null, d: number) {
    if (id === null) return;
    const node = byId.get(id);
    if (!node) return;
    visit(node.left, d + 1);
    rank.set(id, counter++);
    depth.set(id, d);
    maxDepth = Math.max(maxDepth, d);
    visit(node.right, d + 1);
  }
  visit(state.root, 0);

  const n = Math.max(1, counter);
  const colWidth = width / n;
  const rowHeight = maxDepth === 0 ? height / 2 : height / (maxDepth + 1.4);

  return state.nodes
    .filter((node) => rank.has(node.id))
    .map((node) => ({
      id: node.id,
      value: node.value,
      left: node.left,
      right: node.right,
      x: Math.min(
        width - nodeRadius,
        Math.max(nodeRadius, (rank.get(node.id) as number) * colWidth + colWidth / 2),
      ),
      y: (depth.get(node.id) as number) * rowHeight + nodeRadius + 4,
    }));
}
