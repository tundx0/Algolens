import type { StructureTransform, TestCase } from "@algolens/exercises";

const HARNESS_PREAMBLE = `
import json

class ListNode:
    def __init__(self, val):
        self.val = val
        self.next = None

class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def arr_to_list(arr):
    head = None
    tail = None
    for val in arr:
        node = ListNode(val)
        if head is None:
            head = node
        else:
            tail.next = node
        tail = node
    return head

def list_to_arr(head):
    out = []
    node = head
    while node:
        out.append(node.val)
        node = node.next
    return out

def arr_to_tree(arr):
    if len(arr) == 0 or arr[0] is None:
        return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while queue and i < len(arr):
        node = queue.pop(0)
        if i < len(arr):
            left_val = arr[i]
            i += 1
            if left_val is not None:
                node.left = TreeNode(left_val)
                queue.append(node.left)
        if i < len(arr):
            right_val = arr[i]
            i += 1
            if right_val is not None:
                node.right = TreeNode(right_val)
                queue.append(node.right)
    return root

def tree_to_arr(root):
    if root is None:
        return []
    out = []
    queue = [root]
    while queue:
        node = queue.pop(0)
        if node is None:
            out.append(None)
            continue
        out.append(node.val)
        queue.append(node.left)
        queue.append(node.right)
    while out and out[-1] is None:
        out.pop()
    return out

def normalize(v):
    if isinstance(v, (list, tuple)):
        return [normalize(x) for x in v]
    return v

def apply_arg_transform(args, transform):
    if not transform:
        return args
    def conv(a):
        if not isinstance(a, list):
            return a
        return arr_to_list(a) if transform == "list" else arr_to_tree(a)
    return [conv(a) for a in args]

def apply_result_transform(result, transform):
    if not transform:
        return result
    return list_to_arr(result) if transform == "list" else tree_to_arr(result)

def compare_result(actual, expected, unordered):
    actual = normalize(actual)
    if not unordered:
        return actual == expected
    if not isinstance(actual, list) or not isinstance(expected, list):
        return actual == expected
    if len(actual) != len(expected):
        return False
    key = lambda v: json.dumps(v, sort_keys=True)
    return sorted(actual, key=key) == sorted(expected, key=key)
`;

const HARNESS_RUNNER = `

with open("testcases.json") as f:
    _payload = json.load(f)

_results = []
for _i, _tc in enumerate(_payload["testCases"]):
    try:
        _args = apply_arg_transform(_tc["args"], _payload.get("argTransform"))
        _raw = FUNCTION_NAME(*_args)
        _actual = apply_result_transform(_raw, _payload.get("resultTransform"))
        _pass = compare_result(_actual, _tc["expected"], _tc.get("unordered"))
        _results.append({"index": _i, "pass": _pass, "actual": _actual})
    except Exception as _e:
        _results.append({"index": _i, "pass": False, "error": str(_e)})

print(json.dumps({"results": _results}))
`;

export interface PythonHarnessInput {
  code: string;
  functionName: string;
  testCases: TestCase[];
  argTransform?: StructureTransform;
  resultTransform?: StructureTransform;
}

export function buildPythonHarness(input: PythonHarnessInput): {
  mainPy: string;
  testcasesJson: string;
} {
  const runner = HARNESS_RUNNER.replace("FUNCTION_NAME", input.functionName);
  const mainPy = `${HARNESS_PREAMBLE}\n# ---- user code ----\n${input.code}\n# ---- end user code ----\n${runner}`;
  const testcasesJson = JSON.stringify({
    testCases: input.testCases,
    argTransform: input.argTransform ?? null,
    resultTransform: input.resultTransform ?? null,
  });
  return { mainPy, testcasesJson };
}
