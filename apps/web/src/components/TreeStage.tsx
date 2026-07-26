"use client";

import { layoutTree, motionSpec, type TreeState } from "@algolens/viz-engine";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ROLE_CLASS: Record<string, string> = {
  neutral: "fill-viz-neutral",
  compare: "fill-viz-compare",
  found: "fill-viz-sorted",
  inserted: "fill-viz-sorted",
  deleted: "fill-viz-swap",
  rotating: "fill-viz-pivot",
};

export function TreeStage({ state, speed }: { state: TreeState; speed: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const nodes = size.width > 0 ? layoutTree(state, { width: size.width, height: size.height }) : [];
  const byId = new Map(nodes.map((n) => [n.id, n]));

  const instant = reducedMotion || speed >= motionSpec.collapseAtSpeed;
  const spring = instant ? { duration: 0 } : { type: "spring" as const, ...motionSpec.spring };

  return (
    <div
      ref={containerRef}
      className="relative h-[380px] w-full rounded-lg border border-edge bg-well"
    >
      {size.width > 0 && (
        <svg width={size.width} height={size.height} className="block" role="img" aria-label="Tree visualization">
          {nodes.map((node) => {
            const left = node.left !== null ? byId.get(node.left) : undefined;
            const right = node.right !== null ? byId.get(node.right) : undefined;
            return (
              <g key={`edges-${node.id}`}>
                {left && (
                  <motion.line
                    initial={false}
                    animate={{ x1: node.x, y1: node.y, x2: left.x, y2: left.y }}
                    transition={spring}
                    stroke="var(--edge-strong)"
                    strokeWidth={2}
                  />
                )}
                {right && (
                  <motion.line
                    initial={false}
                    animate={{ x1: node.x, y1: node.y, x2: right.x, y2: right.y }}
                    transition={spring}
                    stroke="var(--edge-strong)"
                    strokeWidth={2}
                  />
                )}
              </g>
            );
          })}

          {nodes.map((node) => {
            const role = state.roles?.[node.id] ?? "neutral";
            const isSpecial = role === "compare" || role === "rotating";
            return (
              <motion.g
                key={node.id}
                initial={false}
                animate={{ x: node.x, y: node.y, scale: isSpecial ? 1.15 : 1 }}
                transition={spring}
              >
                <circle
                  r={22}
                  className={`viz-bar ${ROLE_CLASS[role] ?? ROLE_CLASS.neutral}`}
                  stroke={isSpecial ? "var(--accent)" : "transparent"}
                  strokeWidth={2}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-mono text-[13px] font-semibold"
                  style={{ fill: "#0B1029" }}
                >
                  {node.value}
                </text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
