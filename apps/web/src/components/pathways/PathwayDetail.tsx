"use client";

import { getPathway, pathwayStepCount, type PathwayStep } from "@algolens/pathways";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { StepCard } from "./StepCard";

export function PathwayDetail({ id }: { id: string }) {
  const pathway = getPathway(id);
  const utils = trpc.useUtils();

  const { data: pathwayProgress } = trpc.pathways.getAll.useQuery();
  const { data: algoProgress } = trpc.progress.getAll.useQuery();
  const { data: exerciseProgress } = trpc.exercises.getAll.useQuery();

  const markComplete = trpc.pathways.markStepComplete.useMutation({
    onSuccess: () => utils.pathways.getAll.invalidate(),
  });
  const unmark = trpc.pathways.unmarkStep.useMutation({
    onSuccess: () => utils.pathways.getAll.invalidate(),
  });

  if (!pathway) {
    return (
      <div className="mx-auto max-w-[820px] px-8 py-14 text-ink-2">
        Pathway not found.
      </div>
    );
  }

  const manuallyDone = new Set(pathwayProgress?.[pathway.id] ?? []);

  function isComplete(step: PathwayStep): boolean {
    if (step.kind === "visualize" && step.algorithmId) {
      return algoProgress?.[step.algorithmId] === "COMPLETED";
    }
    if (step.kind === "practice" && step.exerciseId) {
      return exerciseProgress?.[step.exerciseId]?.status === "SOLVED";
    }
    return manuallyDone.has(step.id);
  }

  const total = pathwayStepCount(pathway);
  const done = pathway.stages.reduce(
    (n, stage) => n + stage.steps.filter(isComplete).length,
    0,
  );

  return (
    <div className="mx-auto max-w-[760px] px-6 py-14">
      <Link href="/pathways" className="text-[12px] font-semibold text-ink-3 hover:text-ink">
        ← All pathways
      </Link>

      <div className="mt-4 mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-text">
        {pathway.tagline}
      </div>
      <h1 className="font-display text-[32px] font-bold tracking-tight">
        {pathway.title}
      </h1>
      <p className="mt-3 max-w-[60ch] text-[14.5px] leading-relaxed text-ink-2">
        {pathway.description}
      </p>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-pill bg-surface-2">
          <div
            className="h-full rounded-pill bg-accent transition-[width] duration-300"
            style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
          />
        </div>
        <span className="font-mono text-[12px] text-ink-3">
          {done} / {total}
        </span>
      </div>

      <div className="mt-14 flex flex-col gap-14">
        {pathway.stages.map((stage) => {
          const stageDone = stage.steps.filter(isComplete).length;
          return (
            <section key={stage.id}>
              <div className="mb-6 flex items-start gap-4">
                <span className="font-display text-[40px] leading-none text-accent-text">
                  {stage.kanji}
                </span>
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
                    {stage.romaji} · {stageDone}/{stage.steps.length}
                  </div>
                  <h2 className="font-display text-[22px] font-bold tracking-tight">
                    {stage.name}
                  </h2>
                  <p className="mt-1.5 max-w-[56ch] text-[13.5px] leading-relaxed text-ink-2">
                    {stage.philosophy}
                  </p>
                </div>
              </div>

              <div className="relative flex flex-col gap-5">
                <span
                  aria-hidden
                  className="absolute bottom-4 left-[13px] top-4 w-px bg-edge"
                />
                {stage.steps.map((step) => {
                  const complete = isComplete(step);
                  const manual = step.kind === "reading" || step.kind === "project";
                  return (
                    <StepCard
                      key={step.id}
                      step={step}
                      complete={complete}
                      onToggleManual={
                        manual
                          ? () =>
                              complete
                                ? unmark.mutate({ pathwayId: pathway.id, stepId: step.id })
                                : markComplete.mutate({ pathwayId: pathway.id, stepId: step.id })
                          : undefined
                      }
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
