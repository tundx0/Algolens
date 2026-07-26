import type { ReactNode } from "react";

type Variant = "complexity" | "beginner" | "intermediate" | "advanced";

const variants: Record<Variant, string> = {
  complexity: "text-ink-2 border-edge-strong bg-surface-2",
  beginner: "text-viz-sorted border-viz-sorted/45 bg-viz-sorted/10",
  intermediate: "text-viz-compare border-viz-compare/45 bg-viz-compare/10",
  advanced: "text-viz-swap border-viz-swap/45 bg-viz-swap/10",
};

export interface BadgeProps {
  variant?: Variant;
  children: ReactNode;
}

export function Badge({ variant = "complexity", children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-pill border px-3 py-1 font-mono text-[11.5px] ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
