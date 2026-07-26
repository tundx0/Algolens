import type { GridState } from "../types";

export interface GridCell {
  row: number;
  col: number;
  index: number;
  x: number;
  y: number;
  size: number;
}

export interface GridLayoutOptions {
  width: number;
  height: number;
  gapRatio?: number;
}

/**
 * Pure geometry: GridState in, positioned square cells out. Consumed by the
 * canvas renderer (and any future SVG/DOM grid renderer) so cell math never
 * forks between backends.
 */
export function layoutGrid(
  state: Pick<GridState, "rows" | "cols">,
  { width, height, gapRatio = 0.08 }: GridLayoutOptions,
): { cells: GridCell[]; cellSize: number } {
  const { rows, cols } = state;
  if (rows === 0 || cols === 0) return { cells: [], cellSize: 0 };

  const cellSize = Math.min(width / cols, height / rows);
  const gap = cellSize * gapRatio;
  const offsetX = (width - cellSize * cols) / 2;
  const offsetY = (height - cellSize * rows) / 2;

  const cells: GridCell[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      cells.push({
        row,
        col,
        index: row * cols + col,
        x: offsetX + col * cellSize + gap / 2,
        y: offsetY + row * cellSize + gap / 2,
        size: cellSize - gap,
      });
    }
  }
  return { cells, cellSize };
}
