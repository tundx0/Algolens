import type { ArrayState } from "../types";

export type BarRole = "neutral" | "compare" | "swap" | "sorted" | "pivot";

export interface BarLayout {
  /** stable element identity — the renderer's animation key */
  id: number;
  value: number;
  index: number;
  x: number;
  width: number;
  height: number;
  role: BarRole;
  lifted: boolean;
}

export interface ArrayLayoutOptions {
  width: number;
  height: number;
  /** gap as a fraction of slot width */
  gapRatio?: number;
  /** bars shorter than this fraction of height stay visible */
  minHeightRatio?: number;
}

/**
 * Pure geometry: ArrayState in, positioned bars out. The React/SVG layer and
 * the future canvas renderer both consume this, so bar math never forks.
 */
export function layoutArray(
  state: ArrayState,
  { width, height, gapRatio = 0.25, minHeightRatio = 0.08 }: ArrayLayoutOptions,
): BarLayout[] {
  const n = state.values.length;
  if (n === 0) return [];

  const slot = width / n;
  const gap = slot * gapRatio;
  const barWidth = slot - gap;
  const max = Math.max(...state.values, 1);
  const sorted = new Set(state.sorted ?? []);

  return state.values.map((value, index) => {
    const inCompare = state.compare?.includes(index) ?? false;
    const inSwap = state.swap?.includes(index) ?? false;

    let role: BarRole = "neutral";
    if (inSwap) role = "swap";
    else if (inCompare) role = "compare";
    else if (state.pivot === index) role = "pivot";
    else if (sorted.has(index)) role = "sorted";

    return {
      id: state.ids[index] ?? index,
      value,
      index,
      x: index * slot + gap / 2,
      width: barWidth,
      height: Math.max(minHeightRatio, value / max) * height,
      role,
      lifted: inCompare || inSwap,
    };
  });
}
