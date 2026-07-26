import Link from "next/link";
import { LiveSort } from "@/components/landing/LiveSort";
import { MotionGrammarCards } from "@/components/landing/MotionGrammarCards";
import { Reveal } from "@/components/landing/Reveal";

const categories = [
  { name: "Sorting", detail: "6 algorithms", live: true },
  { name: "Searching", detail: "Phase 2" },
  { name: "Graphs & pathfinding", detail: "Phase 2" },
  { name: "Trees", detail: "Phase 2" },
  { name: "Dynamic programming", detail: "Phase 2" },
  { name: "Linked lists", detail: "Planned" },
  { name: "Stacks & queues", detail: "Planned" },
  { name: "Hashing", detail: "Planned" },
];

export default function LandingPage() {
  return (
    <div className="landing-atmosphere min-h-dvh">
      <nav className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-6">
        <span className="font-display text-[20px] font-bold tracking-tight">
          Algo<span className="text-accent-text">Lens</span>
        </span>
        <Link
          href="/visualize"
          className="rounded-sm border border-edge-strong px-4 py-2 text-[13px] font-semibold text-ink transition-colors duration-[120ms] hover:border-ink-3 hover:bg-surface-2"
        >
          Open the visualizer
        </Link>
      </nav>

      {/* Hero */}
      <header className="mx-auto max-w-[1120px] px-6 pb-4 pt-16 text-center">
        <Reveal>
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-text">
            Interactive data structures &amp; algorithms
          </div>
          <h1 className="mx-auto max-w-[16ch] font-display text-[clamp(44px,7vw,84px)] font-bold leading-[1.02] tracking-[-0.03em]">
            See algorithms <span className="text-accent-text">think</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-[52ch] text-[16.5px] leading-relaxed text-ink-2">
            Every compare lifts. Every swap arcs. Every finished element locks
            green. AlgoLens animates the <em>meaning</em> of each step — so you
            can watch with the sound off and still understand exactly what the
            algorithm did.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-9 flex items-center justify-center gap-3">
            <Link
              href="/visualize"
              className="rounded-sm bg-accent px-6 py-3 text-[14.5px] font-semibold text-accent-ink transition-[background,transform] duration-[120ms] hover:bg-accent-hover active:scale-[0.97]"
            >
              Start with bubble sort
            </Link>
            <a
              href="#grammar"
              className="rounded-sm px-5 py-3 text-[14.5px] font-semibold text-ink-2 transition-colors duration-[120ms] hover:bg-surface-2 hover:text-ink"
            >
              How it reads ↓
            </a>
          </div>
          <div className="mt-7 flex items-center justify-center gap-5 font-mono text-[11px] text-ink-3">
            <span>
              <kbd className="rounded-sm border border-edge-strong bg-surface px-1.5 py-0.5">
                space
              </kbd>{" "}
              play
            </span>
            <span>
              <kbd className="rounded-sm border border-edge-strong bg-surface px-1.5 py-0.5">
                ← →
              </kbd>{" "}
              step
            </span>
            <span>
              <kbd className="rounded-sm border border-edge-strong bg-surface px-1.5 py-0.5">
                ↑ ↓
              </kbd>{" "}
              speed
            </span>
          </div>
        </Reveal>
      </header>

      {/* Live demo — the real engine, not a canned animation */}
      <section className="mx-auto max-w-[1120px] px-6 pt-12">
        <div className="rounded-lg border border-edge bg-well/80 px-6 pb-2 pt-6 backdrop-blur">
          <LiveSort height={280} />
          <p className="pb-3 pt-4 text-center font-mono text-[11px] text-ink-3">
            live · the actual AlgoLens engine sorting a random array on loop —
            amber compares, red swaps, green settles
          </p>
        </div>
      </section>

      {/* Motion grammar */}
      <section id="grammar" className="mx-auto max-w-[1120px] px-6 pt-28">
        <Reveal>
          <h2 className="font-display text-[34px] font-bold tracking-tight">
            Motion is the language
          </h2>
          <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-ink-2">
            One motion vocabulary, shared by every algorithm on the platform. A
            compare looks the same in bubble sort as it does in a binary search
            tree — so once you can read it, you can read everything.
          </p>
        </Reveal>
        <div className="mt-10">
          <MotionGrammarCards />
        </div>
      </section>

      {/* Architecture */}
      <section className="mx-auto max-w-[1120px] px-6 pt-28">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-[34px] font-bold tracking-tight">
              Algorithms are data.
              <br />
              The engine just plays them.
            </h2>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-ink-2">
              Every algorithm is a pure generator that yields state snapshots.
              The engine is a tape player: it can pause, scrub backwards, and
              replay any moment — because the steps are values, not side
              effects. That is also why the whole visualizer works offline and
              why a new algorithm is one new file.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <pre className="overflow-x-auto rounded-md border border-edge bg-well p-6 font-mono text-[12.5px] leading-[1.75] text-ink-2">
              <code>{`// one file. no engine changes. no UI changes.
export const yourAlgorithm = {
  id: "your-algorithm",
  category: "sorting",
  *generateSteps(input) {
    yield {
      description: "Compare a[0] with a[1]",
      state: { kind: "array", ... },
    };
  },
};`}</code>
            </pre>
          </Reveal>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-[1120px] px-6 pt-28">
        <Reveal>
          <h2 className="font-display text-[34px] font-bold tracking-tight">
            The curriculum
          </h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, i) => (
            <Reveal key={category.name} delay={i * 0.04}>
              {category.live ? (
                <Link
                  href="/visualize"
                  className="block rounded-md border border-accent/50 bg-accent/5 p-5 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="text-[14.5px] font-semibold text-ink">
                    {category.name}
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-accent-text">
                    live now → {category.detail}
                  </div>
                </Link>
              ) : (
                <div className="rounded-md border border-edge bg-surface p-5">
                  <div className="text-[14.5px] font-semibold text-ink-2">
                    {category.name}
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-ink-3">
                    {category.detail}
                  </div>
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="mx-auto max-w-[1120px] px-6 pb-16 pt-28">
        <Reveal>
          <div className="flex flex-col items-center gap-6 rounded-lg border border-edge bg-surface px-8 py-14 text-center">
            <h2 className="max-w-[22ch] font-display text-[30px] font-bold leading-tight tracking-tight">
              Stop reading pseudocode. Watch it run.
            </h2>
            <Link
              href="/visualize"
              className="rounded-sm bg-accent px-6 py-3 text-[14.5px] font-semibold text-accent-ink transition-[background,transform] duration-[120ms] hover:bg-accent-hover active:scale-[0.97]"
            >
              Open the visualizer
            </Link>
          </div>
          <p className="pt-10 text-center font-mono text-[11px] text-ink-3">
            AlgoLens · dark-first · keyboard-first · every animation encodes
            meaning
          </p>
        </Reveal>
      </footer>
    </div>
  );
}
