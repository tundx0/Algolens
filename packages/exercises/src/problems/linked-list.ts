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
    languages: {
      python: {
        functionName: "merge_two_lists",
        starterCode: `# list1 and list2 are nodes with .val and .next (or None)
def merge_two_lists(list1, list2):
    # your code here
    pass`,
        solutionCode: `def merge_two_lists(list1, list2):
    dummy = ListNode(0)
    tail = dummy
    while list1 and list2:
        if list1.val <= list2.val:
            tail.next = list1
            list1 = list1.next
        else:
            tail.next = list2
            list2 = list2.next
        tail = tail.next
    tail.next = list1 if list1 else list2
    return dummy.next`,
      },
    },
  },
  {
    id: "remove-nth-node-from-end",
    title: "Remove Nth Node From End of List",
    category: "linked-list",
    difficulty: "medium",
    prompt: `Given the head of a linked list, remove the \`n\`th node from the end and return the (possibly new) head. Do it in one pass.

Send a \`fast\` pointer \`n\` nodes ahead first, then move both pointers together — when \`fast\` runs out, \`slow\` sits right before the node to remove.

**Example**
\`\`\`
Input: head = [1, 2, 3, 4, 5], n = 2
Output: [1, 2, 3, 5]
\`\`\``,
    functionName: "removeNthFromEnd",
    argTransform: "list",
    resultTransform: "list",
    starterCode: `/**
 * @param {ListNode} head  // { val, next }
 * @param {number} n
 * @return {ListNode}
 */
function removeNthFromEnd(head, n) {
  // your code here
}`,
    solutionCode: `function removeNthFromEnd(head, n) {
  const dummy = { val: 0, next: head };
  let fast = dummy, slow = dummy;
  for (let i = 0; i < n; i++) fast = fast.next;
  while (fast.next) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
}`,
    testCases: [
      { args: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5] },
      { args: [[1], 1], expected: [] },
      { args: [[1, 2], 1], expected: [1] },
    ],
    languages: {
      python: {
        functionName: "remove_nth_from_end",
        starterCode: `# head is a node with .val and .next
def remove_nth_from_end(head, n: int):
    # your code here
    pass`,
        solutionCode: `def remove_nth_from_end(head, n: int):
    dummy = ListNode(0)
    dummy.next = head
    fast = slow = dummy
    for _ in range(n):
        fast = fast.next
    while fast.next:
        fast = fast.next
        slow = slow.next
    slow.next = slow.next.next
    return dummy.next`,
      },
    },
  },
  {
    id: "reorder-list",
    title: "Reorder List",
    category: "linked-list",
    difficulty: "medium",
    prompt: `Given the head of a linked list \`L0 → L1 → ... → Ln\`, reorder it in place to \`L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → ...\` and return the new head.

Find the middle with slow/fast pointers, reverse the second half, then merge the two halves node by node — three techniques you already have, chained together.

**Example**
\`\`\`
Input: head = [1, 2, 3, 4]
Output: [1, 4, 2, 3]
\`\`\``,
    functionName: "reorderList",
    argTransform: "list",
    resultTransform: "list",
    starterCode: `/**
 * @param {ListNode} head  // { val, next }
 * @return {ListNode}
 */
function reorderList(head) {
  // your code here
}`,
    solutionCode: `function reorderList(head) {
  if (!head || !head.next) return head;

  let slow = head, fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  let second = slow.next;
  slow.next = null;

  let prev = null;
  while (second) {
    const next = second.next;
    second.next = prev;
    prev = second;
    second = next;
  }
  second = prev;

  let first = head;
  while (second) {
    const t1 = first.next, t2 = second.next;
    first.next = second;
    second.next = t1;
    first = t1;
    second = t2;
  }
  return head;
}`,
    testCases: [
      { args: [[1, 2, 3, 4]], expected: [1, 4, 2, 3] },
      { args: [[1, 2, 3, 4, 5]], expected: [1, 5, 2, 4, 3] },
      { args: [[1, 2]], expected: [1, 2] },
    ],
    languages: {
      python: {
        functionName: "reorder_list",
        starterCode: `# head is a node with .val and .next
def reorder_list(head):
    # your code here
    pass`,
        solutionCode: `def reorder_list(head):
    if not head or not head.next:
        return head

    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    second = slow.next
    slow.next = None

    prev = None
    while second:
        nxt = second.next
        second.next = prev
        prev = second
        second = nxt
    second = prev

    first = head
    while second:
        t1, t2 = first.next, second.next
        first.next = second
        second.next = t1
        first = t1
        second = t2
    return head`,
      },
    },
  },
];
