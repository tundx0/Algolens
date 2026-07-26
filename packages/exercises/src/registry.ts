import type { ExerciseCategory, ExerciseDefinition } from "./types";
import { arraysHashing } from "./problems/arrays-hashing";
import { backtracking } from "./problems/backtracking";
import { binarySearch } from "./problems/binary-search";
import { bitManipulation } from "./problems/bit-manipulation";
import { dynamicProgramming } from "./problems/dynamic-programming";
import { graphs } from "./problems/graphs";
import { greedy } from "./problems/greedy";
import { heap } from "./problems/heap";
import { intervals } from "./problems/intervals";
import { linkedList } from "./problems/linked-list";
import { slidingWindow } from "./problems/sliding-window";
import { stack } from "./problems/stack";
import { trees } from "./problems/trees";
import { twoPointers } from "./problems/two-pointers";

/**
 * Explicit barrel registry, same convention as @algolens/algorithms: one
 * file per problem, one import line here.
 */
export const exercises: readonly ExerciseDefinition[] = [
  ...arraysHashing,
  ...twoPointers,
  ...slidingWindow,
  ...stack,
  ...binarySearch,
  ...linkedList,
  ...trees,
  ...graphs,
  ...backtracking,
  ...dynamicProgramming,
  ...greedy,
  ...intervals,
  ...heap,
  ...bitManipulation,
];

export function getExercise(id: string): ExerciseDefinition | undefined {
  return exercises.find((e) => e.id === id);
}

export function exercisesByCategory(): Map<ExerciseCategory, ExerciseDefinition[]> {
  const map = new Map<ExerciseCategory, ExerciseDefinition[]>();
  for (const exercise of exercises) {
    const list = map.get(exercise.category) ?? [];
    list.push(exercise);
    map.set(exercise.category, list);
  }
  return map;
}
