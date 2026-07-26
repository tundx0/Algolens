"use client";

import { bubbleSort } from "@algolens/algorithms";
import { layoutArray, motionSpec } from "@algolens/viz-engine";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePlayer } from "@/hooks/usePlayer";

function randomArray(n: number): number[] {
  return Array.from({ length: n }, () => 4 + Math.floor(Math.random() * 96));
}

const FALLBACK = [...bubbleSort.generateSteps([2, 1])];

/**
 * The landing hero runs the real engine — the same StepPlayer and the same
 * bubble-sort generator the visualizer uses. No canned animation.
 */
export function LiveSort({ height = 300 }: { height?: number }) {
  const [input, setInput] = useState<number[] | null>(null);
  const reducedMotion = useReducedMotion();

  // Random input only after mount, so SSR and client HTML agree.
  useEffect(() => {
    setInput(randomArray(18));
  }, []);

  const steps = useMemo(
    () => (input ? [...bubbleSort.generateSteps(input)] : FALLBACK),
    [input],
  );
  const { player, snap } = usePlayer(steps);

  useEffect(() => {
    if (!input) return;
    player.setSpeed(4);
    player.play();
  }, [player, input]);

  // Loop forever: settle, breathe, reshuffle.
  useEffect(() => {
    if (input && snap.index === snap.length - 1 && !snap.playing) {
      const timer = setTimeout(() => setInput(randomArray(18)), 1600);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [input, snap.index, snap.playing, snap.length]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const state = snap.step.state;
  const bars =
    width > 0 && input && state.kind === "array"
      ? layoutArray(state, {
          width,
          height: height - motionSpec.liftPx - 8,
          gapRatio: 0.2,
        })
      : [];

  const spring = reducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, ...motionSpec.spring };

  return (
    <div ref={containerRef} className="w-full" style={{ height }} aria-hidden>
      {bars.length > 0 && (
        <svg width={width} height={height} className="block">
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
                y={height - bar.height}
                rx={5}
              />
            </motion.g>
          ))}
        </svg>
      )}
    </div>
  );
}
