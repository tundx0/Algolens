"use client";

import { Reveal } from "./Reveal";

function Bar({
  height,
  animation,
  delay,
}: {
  height: number;
  animation?: string;
  delay?: string;
}) {
  return (
    <span
      className="lg-anim w-[18px] rounded-[4px] bg-viz-neutral"
      style={{
        height,
        animation,
        animationDelay: delay,
      }}
    />
  );
}

const cards = [
  {
    name: "Compare",
    body: "The two elements under inspection lift and pulse amber — identical in bubble sort and in a BST search.",
    demo: (
      <div className="flex items-end gap-2">
        <Bar height={34} />
        <Bar height={52} animation="lg-lift 2.6s ease-in-out infinite" />
        <Bar height={40} animation="lg-lift 2.6s ease-in-out infinite" />
        <Bar height={62} />
      </div>
    ),
  },
  {
    name: "Swap",
    body: "Out-of-order elements arc past each other. Nothing ever teleports; motion carries the meaning.",
    demo: (
      <div className="flex items-end gap-2">
        <Bar height={58} animation="lg-swap-a 3.2s ease-in-out infinite" />
        <Bar height={30} animation="lg-swap-b 3.2s ease-in-out infinite" />
        <Bar height={44} />
      </div>
    ),
  },
  {
    name: "Settle",
    body: "A finalized element drops into place with a spring bounce and locks green. Finality feels final.",
    demo: (
      <div className="flex items-end gap-2">
        <Bar height={28} />
        <Bar height={42} />
        <Bar height={56} animation="lg-settle 3s ease-out infinite" />
      </div>
    ),
  },
  {
    name: "Visit",
    body: "Graph exploration spreads as a ripple from the source — BFS and DFS become distinguishable by shape alone.",
    demo: (
      <div className="flex items-center gap-2.5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="lg-anim h-3.5 w-3.5 rounded-full bg-surface-2"
            style={{
              animation: "lg-visit 2.8s ease-out infinite",
              animationDelay: `${i * 0.22}s`,
            }}
          />
        ))}
      </div>
    ),
  },
  {
    name: "Reject",
    body: "A dead end flashes red with a quick shake — visually “no, not this one” — then fades back to neutral.",
    demo: (
      <div className="flex items-end gap-2">
        <Bar height={46} />
        <Bar height={34} animation="lg-reject 3.4s ease-in-out infinite" />
        <Bar height={58} />
      </div>
    ),
  },
];

export function MotionGrammarCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, i) => (
        <Reveal key={card.name} delay={i * 0.07}>
          <div className="flex h-full flex-col rounded-md border border-edge bg-surface p-6">
            <div className="grid h-24 place-items-center rounded-sm bg-well">
              {card.demo}
            </div>
            <h3 className="mt-5 font-display text-[17px] font-bold">
              {card.name}
            </h3>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">
              {card.body}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
