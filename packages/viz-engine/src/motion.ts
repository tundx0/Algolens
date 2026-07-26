/**
 * The motion grammar's shared constants. Framer Motion binds these for
 * SVG/DOM; the Phase 2 canvas renderer binds the same values in its rAF
 * interpolator. One vocabulary, two backends.
 */
export const motionSpec = {
  /** duration of one algorithm step at 1x speed */
  baseStepMs: 600,
  /** spring for all positional movement (swaps, pointer slides) */
  spring: { stiffness: 300, damping: 25 },
  /** per-element delay when many elements change in one step */
  staggerMs: 50,
  /** compare/swap lift distance */
  liftPx: 8,
  /** at and above this speed, multi-part animations collapse to end states */
  collapseAtSpeed: 4,
  /** UI chrome transitions */
  uiMs: 200,
  uiFastMs: 120,
  /** playback speed stops */
  speeds: [0.25, 0.5, 1, 2, 4, 8],
} as const;

export type PlaybackSpeed = (typeof motionSpec.speeds)[number];
