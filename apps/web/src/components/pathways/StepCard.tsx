"use client";

import { getAlgorithm } from "@algolens/algorithms";
import { getExercise } from "@algolens/exercises";
import type { PathwayStep } from "@algolens/pathways";
import { Badge } from "@algolens/ui";
import Link from "next/link";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const kindLabel: Record<PathwayStep["kind"], string> = {
  reading: "Read",
  visualize: "Watch",
  practice: "Solve",
  project: "Build",
};

export function StepCard({
  step,
  complete,
  onToggleManual,
}: {
  step: PathwayStep;
  complete: boolean;
  /** only called for kinds that don't derive completion from other tables (reading/project) */
  onToggleManual?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const algo = step.algorithmId ? getAlgorithm(step.algorithmId) : undefined;
  const exercise = step.exerciseId ? getExercise(step.exerciseId) : undefined;

  return (
    <div className="relative pl-10">
      <span
        className={`absolute left-0 top-1 grid h-7 w-7 place-items-center rounded-full border-2 text-[12px] font-bold ${
          complete
            ? "border-viz-sorted bg-viz-sorted/15 text-viz-sorted"
            : "border-edge-strong bg-well text-ink-3"
        }`}
      >
        {complete ? "✓" : ""}
      </span>

      <div className="rounded-md border border-edge bg-surface p-5">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.1em] text-accent-text">
            {kindLabel[step.kind]}
          </span>
          {step.project && (
            <Badge>{step.project.estimatedHours}h estimate</Badge>
          )}
        </div>
        <h3 className="text-[15.5px] font-bold text-ink">{step.title}</h3>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">
          {step.description}
        </p>

        {step.kind === "visualize" && algo && (
          <Link
            href={`/visualize?algo=${algo.id}`}
            className="mt-3 inline-block rounded-sm border border-edge-strong px-4 py-2 text-[12.5px] font-semibold text-ink transition-colors duration-[120ms] hover:border-ink-3 hover:bg-surface-2"
          >
            Open visualization →
          </Link>
        )}

        {step.kind === "practice" && exercise && (
          <Link
            href={`/practice/${exercise.id}`}
            className="mt-3 inline-block rounded-sm border border-edge-strong px-4 py-2 text-[12.5px] font-semibold text-ink transition-colors duration-[120ms] hover:border-ink-3 hover:bg-surface-2"
          >
            Solve it →
          </Link>
        )}

        {step.kind === "reading" && onToggleManual && (
          <button
            onClick={onToggleManual}
            className={`mt-3 rounded-sm border px-4 py-2 text-[12.5px] font-semibold transition-colors duration-[120ms] ${
              complete
                ? "border-viz-sorted/50 bg-viz-sorted/10 text-viz-sorted"
                : "border-edge-strong text-ink hover:border-ink-3 hover:bg-surface-2"
            }`}
          >
            {complete ? "✓ Marked done" : "Mark as done"}
          </button>
        )}

        {step.kind === "project" && step.project && (
          <div className="mt-3">
            <button
              onClick={() => setOpen((o) => !o)}
              className="text-[12.5px] font-semibold text-accent-text hover:underline"
            >
              {open ? "Hide brief ▲" : "Read the brief ▼"}
            </button>

            {open && (
              <div className="mt-4 flex flex-col gap-4 rounded-md border border-edge bg-well p-5">
                <div className="prose-invert text-[13.5px] leading-relaxed text-ink-2">
                  <ReactMarkdown>{step.project.brief}</ReactMarkdown>
                </div>
                <div>
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">
                    Acceptance criteria
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {step.project.acceptanceCriteria.map((c, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-[13px] text-ink-2"
                      >
                        <span className="mt-0.5 text-accent-text">▸</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {onToggleManual && (
              <button
                onClick={onToggleManual}
                className={`mt-4 block rounded-sm border px-4 py-2 text-[12.5px] font-semibold transition-colors duration-[120ms] ${
                  complete
                    ? "border-viz-sorted/50 bg-viz-sorted/10 text-viz-sorted"
                    : "border-edge-strong text-ink hover:border-ink-3 hover:bg-surface-2"
                }`}
              >
                {complete ? "✓ Project complete" : "Mark project complete"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
