import type { PathwayDefinition } from "./types";
import { backendEngineering } from "./paths/backend-engineering";

/**
 * Explicit barrel registry, same convention as @algolens/algorithms and
 * @algolens/exercises: one file per pathway, one import line here.
 */
export const pathways: readonly PathwayDefinition[] = [backendEngineering];

export function getPathway(id: string): PathwayDefinition | undefined {
  return pathways.find((p) => p.id === id);
}

export function pathwayStepCount(pathway: PathwayDefinition): number {
  return pathway.stages.reduce((n, stage) => n + stage.steps.length, 0);
}
