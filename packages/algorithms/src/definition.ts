import type { CodeLanguage, VisualizationStep } from "@algolens/viz-engine";

export type AlgorithmCategory =
  | "sorting"
  | "searching"
  | "graph"
  | "tree"
  | "dp"
  | "linked-list"
  | "stack-queue"
  | "hashing";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface AlgorithmDefinition<TInput = unknown> {
  id: string;
  name: string;
  category: AlgorithmCategory;
  difficulty: Difficulty;
  timeComplexity: { best: string; average: string; worst: string };
  spaceComplexity: string;
  defaultInput: TInput;
  generateSteps: (input: TInput) => Generator<VisualizationStep>;
  codeImplementations: Record<CodeLanguage, string>;
}

/**
 * Registry-level erased type. Inside an algorithm file the definition is fully
 * typed via TInput; the registry only ever feeds an algorithm its own input.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyAlgorithmDefinition = AlgorithmDefinition<any>;
