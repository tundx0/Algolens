import type { ExerciseDefinition } from "../types";

export const linkedList: ExerciseDefinition[] = [
  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    category: "linked-list",
    difficulty: "easy",
    prompt: `Given the head of a singly linked list, reverse it and return the new head.

Nodes look like \`{ val, next }\`. In the examples below, lists are shown as plain arrays for readability — AlgoLens converts them to real linked-list nodes before your function runs.

**Example**
\`\`\`
Input: head = [1, 2, 3, 4, 5]
Output: [5, 4, 3, 2, 1]
\`\`\``,
    functionName: "reverseList",
    argTransform: "list",
    resultTransform: "list",
    starterCode: `/**
 * @param {ListNode} head  // { val, next }
 * @return {ListNode}
 */
function reverseList(head) {
  // your code here
}`,
    solutionCode: `function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
    testCases: [
      { args: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
      { args: [[1, 2]], expected: [2, 1] },
      { args: [[]], expected: [] },
    ],
    languages: {
      python: {
        functionName: "reverse_list",
        starterCode: `# head is a node with .val and .next
def reverse_list(head):
    # your code here
    pass`,
        solutionCode: `def reverse_list(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
      },
    },
  },
  {
    id: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    category: "linked-list",
    difficulty: "easy",
    prompt: `You're given the heads of two sorted linked lists \`list1\` and \`list2\`. Merge them into one sorted list by splicing the existing nodes together, and return its head.

This is the linked-list version of the merge step in [Merge sort](/visualize?algo=merge-sort).

**Example**
\`\`\`
Input: list1 = [1, 2, 4], list2 = [1, 3, 4]
Output: [1, 1, 2, 3, 4, 4]
\`\`\``,
    functionName: "mergeTwoLists",
    relatedAlgorithmId: "merge-sort",
    argTransform: "list",
    resultTransform: "list",
    starterCode: `/**
 * @param {ListNode} list1  // { val, next }
 * @param {ListNode} list2
 * @return {ListNode}
 */
function mergeTwoLists(list1, list2) {
  // your code here
}`,
    solutionCode: `function mergeTwoLists(list1, list2) {
  const dummy = { val: 0, next: null };
  let tail = dummy;
  while (list1 && list2) {
    if (list1.val <= list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }
  tail.next = list1 || list2;
  return dummy.next;
}`,
    testCases: [
      { args: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] },
      { args: [[], []], expected: [] },
      { args: [[], [0]], expected: [0] },
    ],
  },
];
