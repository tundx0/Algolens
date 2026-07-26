import type { GridCellRole, GridState } from "@algolens/viz-engine";

export interface GridInput {
  rows: number;
  cols: number;
  /** flat indices of wall cells */
  walls: number[];
  start: number;
  end: number;
}

export function defaultGrid(): GridInput {
  const rows = 10;
  const cols = 16;
  const idx = (r: number, c: number) => r * cols + c;
  const walls: number[] = [];
  for (let r = 1; r < rows - 1; r++) {
    if (r === 4) continue; // gap in the wall
    walls.push(idx(r, 6));
  }
  for (let r = 2; r < rows; r++) {
    if (r === 7) continue; // gap in the wall
    walls.push(idx(r, 11));
  }
  return { rows, cols, walls, start: idx(5, 1), end: idx(4, 14) };
}

export function neighbors(index: number, rows: number, cols: number): number[] {
  const row = Math.floor(index / cols);
  const col = index % cols;
  const out: number[] = [];
  if (row > 0) out.push(index - cols);
  if (row < rows - 1) out.push(index + cols);
  if (col > 0) out.push(index - 1);
  if (col < cols - 1) out.push(index + 1);
  return out;
}

export function heuristic(a: number, b: number, cols: number): number {
  const ar = Math.floor(a / cols);
  const ac = a % cols;
  const br = Math.floor(b / cols);
  const bc = b % cols;
  return Math.abs(ar - br) + Math.abs(ac - bc);
}

export function buildCells(
  input: GridInput,
  roles: Map<number, GridCellRole>,
): GridCellRole[] {
  const wallSet = new Set(input.walls);
  const cells: GridCellRole[] = new Array(input.rows * input.cols).fill(
    "empty",
  );
  for (const w of wallSet) cells[w] = "wall";
  for (const [index, role] of roles) {
    if (index === input.start || index === input.end) continue;
    cells[index] = role;
  }
  cells[input.start] = "start";
  cells[input.end] = "end";
  return cells;
}

export function snapshot(
  input: GridInput,
  roles: Map<number, GridCellRole>,
  current?: number,
): GridState {
  return {
    kind: "grid",
    rows: input.rows,
    cols: input.cols,
    cells: buildCells(input, roles),
    current,
  };
}

export function reconstructPath(
  cameFrom: Map<number, number>,
  end: number,
  start: number,
): number[] {
  const path: number[] = [end];
  let cur = end;
  while (cur !== start) {
    const prev = cameFrom.get(cur);
    if (prev === undefined) break;
    path.push(prev);
    cur = prev;
  }
  return path.reverse();
}
