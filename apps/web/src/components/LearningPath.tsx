"use client";

import { algorithms, type Difficulty } from "@algolens/algorithms";
import { Badge } from "@algolens/ui";
import Link from "next/link";
import { trpc } from "@/lib/trpc";

const TIERS: { key: Difficulty; label: string; blurb: string }[] = [
  {
    key: "beginner",
    label: "Beginner",
    blurb: "Start here — the core comparison-based building blocks.",
  },
  {
    key: "intermediate",
    label: "Intermediate",
    blurb: "Divide-and-conquer, graph traversal, and tree structures.",
  },
  {
    key: "advanced",
    label: "Advanced",
    blurb: "Priority-driven search, self-balancing trees, and DP.",
  },
];

const categoryLabels: Record<string, string> = {
  sorting: "Sorting",
  searching: "Searching",
  graph: "Graphs",
  tree: "Trees",
  dp: "Dynamic programming",
  "linked-list": "Linked lists",
  "stack-queue": "Stacks & queues",
  hashing: "Hashing",
};

export function LearningPath() {
  const { data: progress } = trpc.progress.getAll.useQuery();

  const completedCount = progress
    ? Object.values(progress).filter((s) => s === "COMPLETED").length
    : 0;

  return (
    <div className="mx-auto max-w-[820px] px-8 py-14">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.09em] text-accent-text">
        Curriculum
      </div>
      <h1 className="font-display text-[34px] font-bold tracking-tight">
        Your learning path
      </h1>
      <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-ink-2">
        A recommended order, beginner to advanced. Nothing here is locked —
        jump anywhere from the sidebar — but working through it in sequence
        builds each idea on the last.
      </p>
      <p className="mt-4 font-mono text-[12px] text-ink-3">
        {completedCount} / {algorithms.length} completed
      </p>

      <div className="mt-10 flex flex-col gap-10">
        {TIERS.map((tier) => {
          const items = algorithms.filter((a) => a.difficulty === tier.key);
          return (
            <section key={tier.key}>
              <h2 className="font-display text-[20px] font-bold tracking-tight">
                {tier.label}
              </h2>
              <p className="mt-1 text-[13px] text-ink-2">{tier.blurb}</p>

              <ul className="mt-4 flex flex-col gap-2">
                {items.map((algo) => {
                  const status = progress?.[algo.id];
                  return (
                    <li key={algo.id}>
                      <Link
                        href={`/visualize?algo=${algo.id}`}
                        className="flex items-center gap-4 rounded-md border border-edge bg-surface px-4 py-3 transition-transform duration-200 hover:-translate-y-0.5 hover:border-edge-strong"
                      >
                        <span
                          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[12px] ${
                            status === "COMPLETED"
                              ? "border-viz-sorted bg-viz-sorted/15 text-viz-sorted"
                              : status === "VIEWED"
                                ? "border-edge-strong text-ink-3"
                                : "border-edge text-ink-3"
                          }`}
                        >
                          {status === "COMPLETED" ? "✓" : ""}
                        </span>
                        <span className="flex-1">
                          <span className="block text-[14.5px] font-semibold text-ink">
                            {algo.name}
                          </span>
                          <span className="block font-mono text-[11px] text-ink-3">
                            {categoryLabels[algo.category] ?? algo.category}
                          </span>
                        </span>
                        <Badge>{algo.timeComplexity.average}</Badge>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
