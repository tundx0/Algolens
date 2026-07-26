import Link from "next/link";
import { PracticeList } from "@/components/PracticeList";

export default function PracticePage() {
  return (
    <div className="min-h-dvh">
      <nav className="mx-auto flex max-w-[820px] items-center justify-between px-8 pt-8">
        <Link
          href="/"
          className="font-display text-[18px] font-bold tracking-tight"
        >
          Algo<span className="text-accent-text">Lens</span>
        </Link>
        <Link
          href="/visualize"
          className="rounded-sm border border-edge-strong px-4 py-2 text-[13px] font-semibold text-ink transition-colors duration-[120ms] hover:border-ink-3 hover:bg-surface-2"
        >
          Open the visualizer
        </Link>
      </nav>
      <PracticeList />
    </div>
  );
}
