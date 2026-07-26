"use client";

import { algorithmsByCategory } from "@algolens/algorithms";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

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

const difficultyDot: Record<string, string> = {
  beginner: "bg-viz-sorted",
  intermediate: "bg-viz-compare",
  advanced: "bg-viz-swap",
};

export function AlgorithmSidebar({
  activeId,
  onSelect,
  progress,
}: {
  activeId: string;
  onSelect: (id: string) => void;
  progress?: Record<string, "VIEWED" | "COMPLETED">;
}) {
  const grouped = algorithmsByCategory();

  return (
    <aside className="flex h-dvh flex-col gap-7 border-r border-edge bg-surface/50 px-5 py-7">
      <Link
        href="/"
        className="font-display text-[20px] font-bold tracking-tight"
      >
        Algo<span className="text-accent-text">Lens</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto">
        {[...grouped.entries()].map(([category, list]) => (
          <div key={category}>
            <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-ink-3">
              {categoryLabels[category] ?? category}
            </div>
            <ul className="flex flex-col gap-0.5">
              {list.map((algorithm) => (
                <li key={algorithm.id}>
                  <button
                    onClick={() => onSelect(algorithm.id)}
                    className={`flex w-full items-center gap-2.5 rounded-sm px-2.5 py-1.5 text-left text-[13.5px] transition-colors duration-[120ms] ${
                      algorithm.id === activeId
                        ? "bg-accent/10 font-semibold text-ink"
                        : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${difficultyDot[algorithm.difficulty] ?? "bg-viz-neutral"}`}
                      title={algorithm.difficulty}
                    />
                    <span className="flex-1 truncate">{algorithm.name}</span>
                    {progress?.[algorithm.id] === "COMPLETED" && (
                      <span className="shrink-0 text-[11px] text-viz-sorted">✓</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="flex flex-col gap-1.5 border-t border-edge pt-4">
        <div className="flex items-center justify-between">
          <Link
            href="/learn"
            className="text-[11px] font-semibold text-ink-3 hover:text-ink"
          >
            Learning path →
          </Link>
          <ThemeToggle />
        </div>
        <Link
          href="/practice"
          className="text-[11px] font-semibold text-ink-3 hover:text-ink"
        >
          Practice problems →
        </Link>
      </div>
    </aside>
  );
}
