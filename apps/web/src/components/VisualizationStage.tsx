"use client";

import { layoutArray, motionSpec, type ArrayState } from "@algolens/viz-engine";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const POINTER_LANE = 34;

export function VisualizationStage({
  state,
  speed,
  completed,
}: {
  state: ArrayState;
  speed: number;
  completed: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const chartHeight = size.height - POINTER_LANE;
  const bars =
    size.width > 0
      ? layoutArray(state, {
          width: size.width,
          height: chartHeight - motionSpec.liftPx - 22,
        })
      : [];

  // At high speeds (or reduced motion) collapse springs to end states.
  const instant = reducedMotion || speed >= motionSpec.collapseAtSpeed;
  const spring = instant
    ? { duration: 0 }
    : { type: "spring" as const, ...motionSpec.spring };

  const showValues = bars.length > 0 && bars.length <= 24;

  const rangeBar = state.range
    ? { start: bars[state.range[0]], end: bars[state.range[1]] }
    : null;

  return (
    <div
      ref={containerRef}
      className="relative h-[380px] w-full rounded-lg border border-edge bg-well p-0"
    >
      {size.width > 0 && (
        <svg
          width={size.width}
          height={chartHeight}
          className="block"
          role="img"
          aria-label="Algorithm visualization"
        >
          {rangeBar?.start && rangeBar.end && (
            <motion.rect
              initial={false}
              animate={{
                x: rangeBar.start.x - 4,
                width: rangeBar.end.x + rangeBar.end.width - rangeBar.start.x + 8,
              }}
              transition={spring}
              y={chartHeight - 3}
              height={3}
              rx={1.5}
              className="fill-accent/40"
            />
          )}
          {bars.map((bar) => (
            <motion.g
              key={bar.id}
              initial={false}
              animate={{
                x: bar.x,
                y: bar.lifted ? -motionSpec.liftPx : 0,
              }}
              transition={spring}
            >
              <rect
                className={`viz-bar viz-bar-${bar.role}`}
                width={bar.width}
                height={bar.height}
                y={chartHeight - bar.height - 4}
                rx={4}
                style={
                  completed && !reducedMotion
                    ? {
                        transitionDelay: `${bar.index * motionSpec.staggerMs}ms`,
                      }
                    : undefined
                }
              />
              {showValues && (
                <text
                  x={bar.width / 2}
                  y={chartHeight - bar.height - 12}
                  textAnchor="middle"
                  className="fill-ink-3 font-mono text-[11px]"
                >
                  {bar.value}
                </text>
              )}
            </motion.g>
          ))}
        </svg>
      )}

      {/* pointer chips slide between positions — never jump */}
      <div className="relative h-0">
        {size.width > 0 &&
          Object.entries(state.pointers ?? {}).map(([label, index]) => {
            const bar = bars[index];
            if (!bar) return null;
            return (
              <motion.div
                key={label}
                initial={false}
                animate={{ x: bar.x + bar.width / 2 - 14 }}
                transition={spring}
                className="absolute top-1 flex w-7 flex-col items-center"
              >
                <span className="text-[10px] leading-none text-accent-text">
                  ▲
                </span>
                <span className="mt-0.5 rounded-sm border border-edge-strong bg-surface px-1.5 py-0.5 font-mono text-[10.5px] text-ink-2">
                  {label}
                </span>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}
