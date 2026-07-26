"use client";

import {
  StepPlayer,
  type PlayerSnapshot,
  type VisualizationStep,
} from "@algolens/viz-engine";
import { useEffect, useMemo, useSyncExternalStore } from "react";

export function usePlayer(steps: VisualizationStep[]): {
  player: StepPlayer;
  snap: PlayerSnapshot;
} {
  const player = useMemo(() => new StepPlayer(steps), [steps]);

  useEffect(() => () => player.dispose(), [player]);

  const snap = useSyncExternalStore(
    player.subscribe,
    player.getSnapshot,
    player.getSnapshot,
  );

  return { player, snap };
}
