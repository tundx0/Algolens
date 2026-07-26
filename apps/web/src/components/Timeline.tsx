"use client";

import type { StepPlayer, VisualizationStep } from "@algolens/viz-engine";
import { useMemo } from "react";

/** Video-style scrubber with key-event markers (swaps, pass boundaries). */
export function Timeline({
  player,
  steps,
  index,
}: {
  player: StepPlayer;
  steps: VisualizationStep[];
  index: number;
}) {
  const markers = useMemo(
    () =>
      steps
        .map((step, i) => ({ event: step.metadata?.event, i }))
        .filter(({ event }) => event === "swap" || event === "pass-end"),
    [steps],
  );

  const max = steps.length - 1;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-[9px] h-2">
        {markers.map(({ event, i }) => (
          <span
            key={i}
            className={`absolute top-0 h-2 w-0.5 rounded-full ${
              event === "swap" ? "bg-viz-swap/70" : "bg-viz-compare/70"
            }`}
            style={{ left: `${max > 0 ? (i / max) * 100 : 0}%` }}
          />
        ))}
      </div>
      <input
        type="range"
        className="timeline relative"
        min={0}
        max={max}
        value={index}
        aria-label="Scrub through steps"
        onChange={(e) => {
          player.pause();
          player.seek(Number(e.target.value));
        }}
      />
    </div>
  );
}
