import type { AlgorithmCategory, AnyAlgorithmDefinition } from "./definition";
import { aStar } from "./graph/a-star";
import { bfs } from "./graph/bfs";
import { dfs } from "./graph/dfs";
import { dijkstra } from "./graph/dijkstra";
import { binarySearch } from "./searching/binary-search";
import { linearSearch } from "./searching/linear-search";
import { fibonacciMemo } from "./dp/fibonacci-memo";
import { knapsack } from "./dp/knapsack";
import { avlInsert } from "./tree/avl-insert";
import { bstDelete } from "./tree/bst-delete";
import { bstInsert } from "./tree/bst-insert";
import { bstSearch } from "./tree/bst-search";
import { bstTraversal } from "./tree/bst-traversal";
import { bubbleSort } from "./sorting/bubble-sort";
import { heapSort } from "./sorting/heap-sort";
import { insertionSort } from "./sorting/insertion-sort";
import { mergeSort } from "./sorting/merge-sort";
import { quickSort } from "./sorting/quick-sort";
import { selectionSort } from "./sorting/selection-sort";

/**
 * Explicit barrel registry: adding an algorithm is one file plus one line
 * here. (True filesystem auto-discovery is bundler-hostile; if this line ever
 * feels like friction we generate this file from a glob in Phase 4.)
 */
export const algorithms: readonly AnyAlgorithmDefinition[] = [
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
  linearSearch,
  binarySearch,
  bfs,
  dfs,
  dijkstra,
  aStar,
  bstInsert,
  bstSearch,
  bstTraversal,
  bstDelete,
  avlInsert,
  fibonacciMemo,
  knapsack,
];

export function getAlgorithm(id: string): AnyAlgorithmDefinition | undefined {
  return algorithms.find((a) => a.id === id);
}

export function algorithmsByCategory(): Map<
  AlgorithmCategory,
  AnyAlgorithmDefinition[]
> {
  const map = new Map<AlgorithmCategory, AnyAlgorithmDefinition[]>();
  for (const algorithm of algorithms) {
    const list = map.get(algorithm.category) ?? [];
    list.push(algorithm);
    map.set(algorithm.category, list);
  }
  return map;
}
