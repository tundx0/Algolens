"use client";

import type { StepPlayer, VisualizationStep } from "@algolens/viz-engine";
import { useEffect, useRef, useState } from "react";

/**
 * Progressive disclosure: one-line narration by default, full clickable log
 * on demand. Clicking a line jumps the visualization to that step.
 */
export function NarrationPanel({
  player,
  steps,
  index,
}: {
  player: StepPlayer;
  steps: VisualizationStep[];
  index: number;
}) {
  const [logOpen, setLogOpen] = useState(false);
  const activeRef = useRef<HTMLButtonElement>(null);
  const current = steps[index];

  useEffect(() => {
    if (logOpen) {
      activeRef.current?.scrollIntoView({ block: "nearest" });
    }
  }, [index, logOpen]);

  return (
    <div className="rounded-md border border-edge bg-surface">
      <div className="flex items-start justify-between gap-4 px-5 py-4">
        <p className="text-[15px] leading-relaxed text-ink">
          {current?.description ?? ""}
        </p>
        <button
          onClick={() => setLogOpen((open) => !open)}
          className="shrink-0 rounded-sm px-2 py-1 text-[12px] font-semibold text-ink-3 hover:bg-surface-2 hover:text-ink"
        >
          {logOpen ? "Hide log" : "All steps"}
        </button>
      </div>

      {logOpen && (
        <div className="max-h-64 overflow-y-auto border-t border-edge px-2 py-2">
          {steps.map((step, i) => (
            <button
              key={i}
              ref={i === index ? activeRef : undefined}
              onClick={() => {
                player.pause();
                player.seek(i);
              }}
              className={`flex w-full gap-3 rounded-sm px-3 py-1.5 text-left font-mono text-[12px] ${
                i === index
                  ? "bg-accent/10 text-ink"
                  : "text-ink-2 hover:bg-surface-2"
              }`}
            >
              <span
                className={`w-8 shrink-0 text-right tabular-nums ${
                  i === index ? "text-accent-text" : "text-ink-3"
                }`}
              >
                {i + 1}
              </span>
              <span>{step.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
