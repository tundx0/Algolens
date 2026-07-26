import type { StructureTransform } from "./types";

interface ListNode {
  val: unknown;
  next: ListNode | null;
}

interface TreeNode {
  val: unknown;
  left: TreeNode | null;
  right: TreeNode | null;
}

export function arrToList(arr: unknown[]): ListNode | null {
  let head: ListNode | null = null;
  let tail: ListNode | null = null;
  for (const val of arr) {
    const node: ListNode = { val, next: null };
    if (!head) head = node;
    else tail!.next = node;
    tail = node;
  }
  return head;
}

export function listToArr(head: ListNode | null): unknown[] {
  const out: unknown[] = [];
  let node = head;
  while (node) {
    out.push(node.val);
    node = node.next;
  }
  return out;
}

/** Level-order array with `null` for missing children, e.g. [3, 9, 20, null, null, 15, 7]. */
export function arrToTree(arr: unknown[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root: TreeNode = { val: arr[0], left: null, right: null };
  const queue: TreeNode[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length) {
      const leftVal = arr[i++];
      if (leftVal !== null && leftVal !== undefined) {
        node.left = { val: leftVal, left: null, right: null };
        queue.push(node.left);
      }
    }
    if (i < arr.length) {
      const rightVal = arr[i++];
      if (rightVal !== null && rightVal !== undefined) {
        node.right = { val: rightVal, left: null, right: null };
        queue.push(node.right);
      }
    }
  }
  return root;
}

export function treeToArr(root: TreeNode | null): unknown[] {
  if (!root) return [];
  const out: unknown[] = [];
  const queue: (TreeNode | null)[] = [root];
  while (queue.length > 0) {
    const node = queue.shift();
    if (node === null || node === undefined) {
      out.push(null);
      continue;
    }
    out.push(node.val);
    queue.push(node.left);
    queue.push(node.right);
  }
  while (out.length > 0 && out[out.length - 1] === null) out.pop();
  return out;
}

export function applyArgTransform(args: unknown[], transform?: StructureTransform): unknown[] {
  if (!transform) return args;
  return args.map((arg) => {
    if (!Array.isArray(arg)) return arg;
    if (transform === "list") return arrToList(arg);
    return arrToTree(arg);
  });
}

export function applyResultTransform(result: unknown, transform?: StructureTransform): unknown {
  if (!transform) return result;
  if (transform === "list") return listToArr(result as ListNode | null);
  return treeToArr(result as TreeNode | null);
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const aKeys = Object.keys(a as object);
    const bKeys = Object.keys(b as object);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((k) =>
      deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]),
    );
  }
  return false;
}

export function compareResult(actual: unknown, expected: unknown, unordered?: boolean): boolean {
  if (!unordered) return deepEqual(actual, expected);
  if (!Array.isArray(actual) || !Array.isArray(expected)) return deepEqual(actual, expected);
  if (actual.length !== expected.length) return false;
  const sortKey = (v: unknown) => JSON.stringify(v);
  const a = [...actual].sort((x, y) => (sortKey(x) < sortKey(y) ? -1 : 1));
  const b = [...expected].sort((x, y) => (sortKey(x) < sortKey(y) ? -1 : 1));
  return a.every((v, i) => deepEqual(v, b[i]));
}
