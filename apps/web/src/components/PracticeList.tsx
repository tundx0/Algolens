"use client";

import { exercisesByCategory, type ExerciseCategory } from "@algolens/exercises";
import { Badge } from "@algolens/ui";
import Link from "next/link";
import { trpc } from "@/lib/trpc";

const categoryLabels: Record<ExerciseCategory, string> = {
  "arrays-hashing": "Arrays & Hashing",
  "two-pointers": "Two Pointers",
  "sliding-window": "Sliding Window",
  stack: "Stack",
  "binary-search": "Binary Search",
  "linked-list": "Linked List",
  trees: "Trees",
  graphs: "Graphs",
  backtracking: "Backtracking",
  "dynamic-programming": "Dynamic Programming",
  greedy: "Greedy",
  intervals: "Intervals",
  heap: "Heap",
  "bit-manipulation": "Bit Manipulation",
};

const difficultyVariant = {
  easy: "beginner",
  medium: "intermediate",
  hard: "advanced",
} as const;

export function PracticeList() {
  const grouped = exercisesByCategory();
  const { data: progress } = trpc.exercises.getAll.useQuery();

  const total = [...grouped.values()].reduce((n, list) => n + list.length, 0);
  const solved = progress
    ? Object.values(progress).filter((p) => p.status === "SOLVED").length
    : 0;

  return (
    <div className="mx-auto max-w-[820px] px-8 py-14">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.09em] text-accent-text">
        Practice
      </div>
      <h1 className="font-display text-[34px] font-bold tracking-tight">
        Interview problems
      </h1>
      <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-ink-2">
        Original problems covering the classic interview patterns, graded
        instantly in your browser — nothing leaves your machine. Several link
        back to the visualization that explains the underlying technique.
      </p>
      <p className="mt-4 font-mono text-[12px] text-ink-3">
        {solved} / {total} solved
      </p>

      <div className="mt-10 flex flex-col gap-8">
        {[...grouped.entries()].map(([category, items]) => (
          <section key={category}>
            <h2 className="font-display text-[18px] font-bold tracking-tight">
              {categoryLabels[category]}
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {items.map((ex) => {
                const status = progress?.[ex.id]?.status;
                return (
                  <li key={ex.id}>
                    <Link
                      href={`/practice/${ex.id}`}
                      className="flex items-center gap-4 rounded-md border border-edge bg-surface px-4 py-3 transition-transform duration-200 hover:-translate-y-0.5 hover:border-edge-strong"
                    >
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[12px] ${
                          status === "SOLVED"
                            ? "border-viz-sorted bg-viz-sorted/15 text-viz-sorted"
                            : status === "ATTEMPTED"
                              ? "border-viz-compare bg-viz-compare/15 text-viz-compare"
                              : "border-edge text-ink-3"
                        }`}
                      >
                        {status === "SOLVED" ? "✓" : status === "ATTEMPTED" ? "•" : ""}
                      </span>
                      <span className="flex-1 text-[14.5px] font-semibold text-ink">
                        {ex.title}
                      </span>
                      <Badge variant={difficultyVariant[ex.difficulty]}>
                        {ex.difficulty}
                      </Badge>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
