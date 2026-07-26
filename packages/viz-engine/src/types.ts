/**
 * Renderers know state *shapes*, never algorithms. Bubble sort and quick sort
 * both emit ArrayState; the bar renderer cannot tell them apart. New shapes
 * (graph, tree, grid, table) join this union in Phase 2.
 */
export interface ArrayState {
  kind: "array";
  /** value at each position */
  values: number[];
  /**
   * Stable identity of the element at each position. Generators carry ids
   * through swaps so renderers can animate elements moving, not repainting.
   */
  ids: number[];
  /** the two positions currently being compared */
  compare?: [number, number];
  /** the two positions currently being swapped */
  swap?: [number, number];
  /** positions locked as finalized/sorted */
  sorted?: number[];
  /** position of a special element (pivot, mid, ...) */
  pivot?: number;
  /** labeled index markers, e.g. { i: 2, j: 3 } */
  pointers?: Record<string, number>;
  /** active subarray being worked on (recursive algorithms) — drawn as a bracket underlay */
  range?: [number, number];
}

export type GridCellRole =
  | "empty"
  | "wall"
  | "start"
  | "end"
  | "frontier"
  | "visited"
  | "path";

export interface GridState {
  kind: "grid";
  rows: number;
  cols: number;
  /** row-major, length rows*cols */
  cells: GridCellRole[];
  /** cell currently being expanded — gets the amber "compare" pulse */
  current?: number;
}

export interface TreeNode {
  id: number;
  value: number;
  left: number | null;
  right: number | null;
  /** AVL balance metadata, purely informational */
  height?: number;
}

export type TreeNodeRole = "neutral" | "compare" | "found" | "inserted" | "deleted" | "rotating";

export interface TreeState {
  kind: "tree";
  nodes: TreeNode[];
  root: number | null;
  /** node id -> role, for the same amber/green/red/purple grammar as arrays */
  roles?: Record<number, TreeNodeRole>;
  /** ids visited so far, in order — used for traversal narration/highlight */
  visitedOrder?: number[];
}

export type TableCellRole =
  | "empty"
  | "computing"
  | "dependency"
  | "filled"
  | "answer";

export interface TableState {
  kind: "table";
  rows: number;
  cols: number;
  /** row-major, length rows*cols; null = not yet computed */
  cells: (number | null)[];
  roles?: Record<number, TableCellRole>;
  rowLabels?: string[];
  colLabels?: string[];
}

export type VizState = ArrayState | GridState | TreeState | TableState;

export type CodeLanguage = "javascript" | "python" | "java";

export interface VisualizationStep {
  /** human-readable narration for this step */
  description: string;
  /** elements currently being compared/touched */
  highlightIndices?: number[];
  /** the data structure's current snapshot */
  state: VizState;
  /** active source line per language, for synced code highlighting */
  codeLine?: Partial<Record<CodeLanguage, number>>;
  metadata?: Record<string, unknown>;
}
