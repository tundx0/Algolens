export type ExerciseDifficulty = "easy" | "medium" | "hard";

export type ExerciseCategory =
  | "arrays-hashing"
  | "two-pointers"
  | "sliding-window"
  | "stack"
  | "binary-search"
  | "linked-list"
  | "trees"
  | "graphs"
  | "backtracking"
  | "dynamic-programming"
  | "greedy"
  | "intervals"
  | "heap"
  | "bit-manipulation";

export interface TestCase {
  /** positional arguments passed to the user's function */
  args: unknown[];
  expected: unknown;
  /** if expected is an array, compare as a multiset (element order ignored) */
  unordered?: boolean;
}

/** How to convert plain-array args/results into richer structures before/after calling the user's function. */
export type StructureTransform = "list" | "tree";

export interface ExerciseDefinition {
  id: string;
  title: string;
  category: ExerciseCategory;
  difficulty: ExerciseDifficulty;
  /** markdown — original wording, written for AlgoLens */
  prompt: string;
  /** name of the function the learner must implement */
  functionName: string;
  /** starter code shown in the editor */
  starterCode: string;
  /** reference solution — revealed only after solving or on request */
  solutionCode: string;
  testCases: TestCase[];
  /** links back to a visualized AlgorithmDefinition id, when directly related */
  relatedAlgorithmId?: string;
  /** converts every array-typed argument into this structure before calling the function (non-array args, like numbers, pass through unchanged) */
  argTransform?: StructureTransform;
  /** converts the function's return value back into a plain array for comparison against `expected` */
  resultTransform?: StructureTransform;
  /** testCases/argTransform/resultTransform are shared across languages; only the code and its idiomatic function name differ */
  languages?: {
    python?: {
      functionName: string;
      starterCode: string;
      solutionCode: string;
    };
  };
}
