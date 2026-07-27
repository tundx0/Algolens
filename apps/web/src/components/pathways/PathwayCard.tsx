"use client";

import { pathwayStepCount, type PathwayDefinition } from "@algolens/pathways";
import Link from "next/link";
import { trpc } from "@/lib/trpc";

export function PathwayCard({ pathway }: { pathway: PathwayDefinition }) {
  const { data } = trpc.pathways.getAll.useQuery();
  const total = pathwayStepCount(pathway);
  const done = data?.[pathway.id]?.length ?? 0;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Link
      href={`/pathways/${pathway.id}`}
      className="group block rounded-lg border border-edge bg-surface p-7 transition-transform duration-200 hover:-translate-y-0.5 hover:border-edge-strong"
    >
      <div className="mb-3 flex items-center gap-3">
        <span className="font-display text-[28px] leading-none text-accent-text">
          {pathway.stages[0]?.kanji}
          {pathway.stages[1]?.kanji}
          {pathway.stages[2]?.kanji}
        </span>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-3">
          Shu · Ha · Ri
        </span>
      </div>
      <h3 className="font-display text-[22px] font-bold tracking-tight text-ink">
        {pathway.title}
      </h3>
      <p className="mt-1 text-[13px] font-semibold text-accent-text">
        {pathway.tagline}
      </p>
      <p className="mt-3 text-[13.5px] leading-relaxed text-ink-2">
        {pathway.description}
      </p>

      <div className="mt-6">
        <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] text-ink-3">
          <span>
            {done} / {total} steps
          </span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-pill bg-surface-2">
          <div
            className="h-full rounded-pill bg-accent transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
