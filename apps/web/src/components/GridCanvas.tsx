"use client";

import { layoutGrid, motionSpec, type GridState } from "@algolens/viz-engine";
import { useEffect, useRef, useState } from "react";
import type { GridInput } from "@algolens/algorithms";

const COLORS = {
  empty: "#171F47",
  wall: "#070A1C",
  frontier: "#22D3EE",
  visited: "#4D7FFF",
  path: "#FAF92A",
  current: "#FFAE1F",
} as const;

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lerpColor(a: [number, number, number], b: [number, number, number], t: number) {
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)}, ${Math.round(a[1] + (b[1] - a[1]) * t)}, ${Math.round(a[2] + (b[2] - a[2]) * t)})`;
}

const RGB = Object.fromEntries(
  Object.entries(COLORS).map(([k, v]) => [k, hexToRgb(v)]),
) as Record<keyof typeof COLORS, [number, number, number]>;

/**
 * Canvas backend for the same motion grammar the SVG stage uses: color is
 * eased (ease-out, ~240ms) via manual rAF interpolation instead of Framer
 * Motion — proof the grammar is data, not a library binding.
 */
export function GridCanvas({
  state,
  editable,
  onEdit,
}: {
  state: GridState;
  editable?: GridInput;
  onEdit?: (next: GridInput) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const dragRef = useRef<null | "wall" | "erase" | "start" | "end">(null);

  const colorRef = useRef<Map<number, [number, number, number]>>(new Map());
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.width === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.width * dpr;
    canvas.height = size.height * dpr;
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;
    ctx.scale(dpr, dpr);

    const { cells } = layoutGrid(state, { width: size.width, height: size.height });

    const draw = (progress: number) => {
      ctx.clearRect(0, 0, size.width, size.height);
      let stillAnimating = false;

      cells.forEach((cell) => {
        const role = state.cells[cell.index] ?? "empty";
        const targetKey: keyof typeof COLORS =
          role === "start" || role === "end" ? "empty" : role;
        const target = RGB[targetKey];
        const prevColor = colorRef.current.get(cell.index) ?? target;

        let drawColor = target;
        if (prevColor !== target) {
          const eased = 1 - Math.pow(1 - progress, 3);
          drawColor = [
            prevColor[0] + (target[0] - prevColor[0]) * eased,
            prevColor[1] + (target[1] - prevColor[1]) * eased,
            prevColor[2] + (target[2] - prevColor[2]) * eased,
          ] as [number, number, number];
          if (eased < 1) stillAnimating = true;
        }

        const radius = Math.min(4, cell.size / 4);
        ctx.fillStyle = `rgb(${drawColor[0]}, ${drawColor[1]}, ${drawColor[2]})`;
        ctx.beginPath();
        ctx.roundRect(cell.x, cell.y, cell.size, cell.size, radius);
        ctx.fill();

        if (cell.index === state.current) {
          ctx.strokeStyle = COLORS.current;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        if (role === "start") {
          ctx.fillStyle = "#FAF92A";
          ctx.beginPath();
          ctx.arc(cell.x + cell.size / 2, cell.y + cell.size / 2, cell.size * 0.28, 0, Math.PI * 2);
          ctx.fill();
        }
        if (role === "end") {
          ctx.fillStyle = "#A78BFA";
          ctx.beginPath();
          ctx.arc(cell.x + cell.size / 2, cell.y + cell.size / 2, cell.size * 0.28, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      return stillAnimating;
    };

    let start: number | null = null;
    const duration = motionSpec.uiMs + 40;

    function frame(t: number) {
      if (start === null) start = t;
      const progress = Math.min(1, (t - start) / duration);
      const stillAnimating = draw(progress);
      if (stillAnimating) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        cells.forEach((cell) => {
          const role = state.cells[cell.index] ?? "empty";
          const targetKey: keyof typeof COLORS =
            role === "start" || role === "end" ? "empty" : role;
          colorRef.current.set(cell.index, RGB[targetKey]);
        });
      }
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, size]);

  const cellAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const { cells } = layoutGrid(state, { width: size.width, height: size.height });
    return cells.find(
      (c) => x >= c.x && x <= c.x + c.size && y >= c.y && y <= c.y + c.size,
    );
  };

  const applyCell = (index: number, mode: "wall" | "erase" | "start" | "end") => {
    if (!editable || !onEdit) return;
    if (index === editable.start || index === editable.end) {
      if (mode === "wall" || mode === "erase") return;
    }
    if (mode === "wall") {
      if (index === editable.start || index === editable.end) return;
      onEdit({ ...editable, walls: [...new Set([...editable.walls, index])] });
    } else if (mode === "erase") {
      onEdit({ ...editable, walls: editable.walls.filter((w) => w !== index) });
    } else if (mode === "start") {
      onEdit({ ...editable, start: index, walls: editable.walls.filter((w) => w !== index) });
    } else if (mode === "end") {
      onEdit({ ...editable, end: index, walls: editable.walls.filter((w) => w !== index) });
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!editable || !onEdit) return;
    const cell = cellAt(e.clientX, e.clientY);
    if (!cell) return;
    if (cell.index === editable.start) dragRef.current = "start";
    else if (cell.index === editable.end) dragRef.current = "end";
    else if (editable.walls.includes(cell.index)) {
      dragRef.current = "erase";
      applyCell(cell.index, "erase");
    } else {
      dragRef.current = "wall";
      applyCell(cell.index, "wall");
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const cell = cellAt(e.clientX, e.clientY);
    if (!cell) return;
    applyCell(cell.index, dragRef.current);
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[380px] w-full touch-none rounded-lg border border-edge bg-well"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <canvas ref={canvasRef} role="img" aria-label="Grid pathfinding visualization" />
    </div>
  );
}
