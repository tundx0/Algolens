"use client";

import { layoutGrid, type TableState } from "@algolens/viz-engine";
import { useEffect, useRef, useState } from "react";

const ROLE_CLASS: Record<string, string> = {
  empty: "bg-surface-2 text-ink-3",
  computing: "bg-viz-compare text-accent-ink",
  dependency: "bg-viz-pivot/40 text-ink",
  filled: "bg-viz-sorted/25 text-ink",
  answer: "bg-accent text-accent-ink",
};

const LABEL_GUTTER = 34;

export function TableStage({ state }: { state: TableState }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hasLabels = Boolean(state.rowLabels || state.colLabels);
  const gutter = hasLabels ? LABEL_GUTTER : 0;
  const { cells } = layoutGrid(
    { rows: state.rows, cols: state.cols },
    { width: Math.max(0, size.width - gutter), height: Math.max(0, size.height - gutter), gapRatio: 0.12 },
  );

  return (
    <div
      ref={containerRef}
      className="relative h-[380px] w-full overflow-auto rounded-lg border border-edge bg-well p-2"
    >
      <div
        className="relative"
        style={{ width: size.width - gutter, height: size.height - gutter, marginLeft: gutter, marginTop: gutter }}
      >
        {state.colLabels?.map((label, i) => {
          const cell = cells.find((c) => c.col === i && c.row === 0);
          if (!cell) return null;
          return (
            <div
              key={`col-${i}`}
              className="absolute flex items-center justify-center font-mono text-[10px] text-ink-3"
              style={{ left: cell.x, top: -gutter, width: cell.size, height: gutter }}
            >
              {label}
            </div>
          );
        })}
        {state.rowLabels?.map((label, i) => {
          const cell = cells.find((c) => c.row === i && c.col === 0);
          if (!cell) return null;
          return (
            <div
              key={`row-${i}`}
              className="absolute flex items-center justify-end pr-1.5 font-mono text-[10px] text-ink-3"
              style={{ top: cell.y, left: -gutter, width: gutter, height: cell.size }}
            >
              {label}
            </div>
          );
        })}

        {cells.map((cell) => {
          const value = state.cells[cell.index];
          const role = state.roles?.[cell.index] ?? (value === null ? "empty" : "filled");
          return (
            <div
              key={cell.index}
              className={`absolute flex items-center justify-center rounded-[5px] font-mono text-[12px] font-semibold transition-colors duration-200 ease-out ${ROLE_CLASS[role] ?? ROLE_CLASS.empty}`}
              style={{ left: cell.x, top: cell.y, width: cell.size, height: cell.size }}
            >
              {value ?? "·"}
            </div>
          );
        })}
      </div>
    </div>
  );
}
