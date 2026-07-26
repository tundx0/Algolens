"use client";

import { motionSpec, type StepPlayer } from "@algolens/viz-engine";

function ControlButton({
  label,
  onClick,
  primary = false,
  children,
}: {
  label: string;
  onClick: () => void;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid h-9 w-9 place-items-center rounded-sm border transition-[background,border-color,transform] duration-[120ms] active:scale-[0.92] ${
        primary
          ? "border-accent bg-accent text-accent-ink hover:bg-accent-hover"
          : "border-edge-strong bg-surface text-ink hover:bg-surface-2"
      }`}
    >
      {children}
    </button>
  );
}

export function PlaybackControls({
  player,
  playing,
  index,
  length,
  speed,
}: {
  player: StepPlayer;
  playing: boolean;
  index: number;
  length: number;
  speed: number;
}) {
  const speeds = motionSpec.speeds;

  const cycleSpeed = (direction: 1 | -1) => {
    const at = speeds.indexOf(speed as (typeof speeds)[number]);
    const next = speeds[Math.max(0, Math.min(speeds.length - 1, at + direction))];
    if (next !== undefined) player.setSpeed(next);
  };

  return (
    <div className="flex items-center gap-2">
      <ControlButton label="Step back (←)" onClick={() => player.stepBack()}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M3.5 1h1.8v10H3.5zM10 1v10L5.5 6z" />
        </svg>
      </ControlButton>

      <ControlButton
        label={playing ? "Pause (space)" : "Play (space)"}
        onClick={() => player.toggle()}
        primary
      >
        {playing ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M2.5 1h2.6v10H2.5zM6.9 1h2.6v10H6.9z" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M2.5 1l8 5-8 5z" />
          </svg>
        )}
      </ControlButton>

      <ControlButton
        label="Step forward (→)"
        onClick={() => player.stepForward()}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M6.7 1h1.8v10H6.7zM2 1l4.5 5L2 11z" />
        </svg>
      </ControlButton>

      <span className="ml-2 font-mono text-[11px] tabular-nums text-ink-3">
        step {index + 1} / {length}
      </span>

      <div className="ml-auto flex items-center gap-1">
        <button
          aria-label="Slower (↓)"
          onClick={() => cycleSpeed(-1)}
          className="rounded-sm px-1.5 py-0.5 text-ink-3 hover:bg-surface-2 hover:text-ink"
        >
          −
        </button>
        <span className="min-w-[52px] rounded-pill border border-edge-strong px-3 py-1 text-center font-mono text-[12px] text-ink-2">
          {speed}×
        </span>
        <button
          aria-label="Faster (↑)"
          onClick={() => cycleSpeed(1)}
          className="rounded-sm px-1.5 py-0.5 text-ink-3 hover:bg-surface-2 hover:text-ink"
        >
          +
        </button>
      </div>
    </div>
  );
}
