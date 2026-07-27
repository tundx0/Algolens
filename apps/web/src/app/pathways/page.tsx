import { pathways } from "@algolens/pathways";
import { PathwayCard } from "@/components/pathways/PathwayCard";
import { SamuraiHero } from "@/components/pathways/SamuraiHero";
import { SiteNav } from "@/components/SiteNav";

export default function PathwaysPage() {
  return (
    <div className="min-h-dvh">
      <div className="absolute inset-x-0 top-0 z-10">
        <SiteNav />
      </div>

      <div className="relative h-[86vh] min-h-[560px] w-full">
        <SamuraiHero />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-6 pb-14 text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-text">
            道 · the way
          </div>
          <h1 className="max-w-[18ch] font-display text-[clamp(32px,5.5vw,58px)] font-bold leading-[1.05] tracking-[-0.02em] text-ink">
            Discipline is the curriculum.
          </h1>
          <p className="max-w-[46ch] text-[14.5px] leading-relaxed text-ink-2">
            One step at a time, in the rain or not. No shortcuts — only the
            walk.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1120px] px-6 py-24">
        <section className="grid gap-10 lg:grid-cols-3">
          <div>
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-text">
              The method
            </div>
            <h2 className="font-display text-[28px] font-bold tracking-tight">
              守破離 — Shu-Ha-Ri
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-2">
              A centuries-old description of how skill actually forms, borrowed
              from the martial and craft traditions of Japan. Every pathway
              here is structured around it — not as decoration, but as the
              actual sequencing logic.
            </p>
          </div>
          <div className="rounded-md border border-edge bg-surface p-6">
            <div className="font-display text-[22px] text-accent-text">守</div>
            <h3 className="mt-1 text-[15px] font-bold text-ink">Shu — follow the form</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
              Obey the form exactly. Build small, complete things by hand.
              Repetition first — instinct comes later.
            </p>
          </div>
          <div className="rounded-md border border-edge bg-surface p-6">
            <div className="font-display text-[22px] text-accent-text">破</div>
            <h3 className="mt-1 text-[15px] font-bold text-ink">Ha — break the form</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
              Adapt the form to problems it wasn&apos;t written for. Real
              tools enter here — you now know what they do underneath.
            </p>
          </div>
        </section>

        <section className="mt-20">
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="font-display text-[28px] font-bold tracking-tight">
              Choose your path
            </h2>
            <span className="font-mono text-[12px] text-ink-3">
              {pathways.length} path{pathways.length === 1 ? "" : "s"} · more forging
            </span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {pathways.map((p) => (
              <PathwayCard key={p.id} pathway={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
