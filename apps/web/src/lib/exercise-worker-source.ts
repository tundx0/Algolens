/**
 * The worker body as a plain-JS string. It runs in a dedicated Worker
 * thread (no DOM access), so a submission that hangs never freezes the UI —
 * the owning hook just terminates the worker after a timeout and spins up a
 * fresh one for the next run. Duplicated (not imported) from
 * @algolens/exercises/harness because Blob-URL workers can't resolve
 * workspace/npm imports; kept in lockstep with harness.ts by design.
 */
export function buildWorkerSource(): string {
  return `
    function arrToList(arr) {
      let head = null, tail = null;
      for (const val of arr) {
        const node = { val, next: null };
        if (!head) head = node; else tail.next = node;
        tail = node;
      }
      return head;
    }
    function listToArr(head) {
      const out = [];
      let node = head;
      while (node) { out.push(node.val); node = node.next; }
      return out;
    }
    function arrToTree(arr) {
      if (arr.length === 0 || arr[0] === null) return null;
      const root = { val: arr[0], left: null, right: null };
      const queue = [root];
      let i = 1;
      while (queue.length > 0 && i < arr.length) {
        const node = queue.shift();
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
    function treeToArr(root) {
      if (!root) return [];
      const out = [];
      const queue = [root];
      while (queue.length > 0) {
        const node = queue.shift();
        if (node === null || node === undefined) { out.push(null); continue; }
        out.push(node.val);
        queue.push(node.left);
        queue.push(node.right);
      }
      while (out.length > 0 && out[out.length - 1] === null) out.pop();
      return out;
    }
    function applyArgTransform(args, transform) {
      if (!transform) return args;
      return args.map((arg) => {
        if (!Array.isArray(arg)) return arg;
        return transform === "list" ? arrToList(arg) : arrToTree(arg);
      });
    }
    function applyResultTransform(result, transform) {
      if (!transform) return result;
      return transform === "list" ? listToArr(result) : treeToArr(result);
    }
    function deepEqual(a, b) {
      if (a === b) return true;
      if (typeof a !== typeof b) return false;
      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        return a.every((v, i) => deepEqual(v, b[i]));
      }
      if (a && b && typeof a === "object" && typeof b === "object") {
        const aKeys = Object.keys(a), bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) return false;
        return aKeys.every((k) => deepEqual(a[k], b[k]));
      }
      return false;
    }
    function compareResult(actual, expected, unordered) {
      if (!unordered) return deepEqual(actual, expected);
      if (!Array.isArray(actual) || !Array.isArray(expected)) return deepEqual(actual, expected);
      if (actual.length !== expected.length) return false;
      const key = (v) => JSON.stringify(v);
      const a = [...actual].sort((x, y) => (key(x) < key(y) ? -1 : 1));
      const b = [...expected].sort((x, y) => (key(x) < key(y) ? -1 : 1));
      return a.every((v, i) => deepEqual(v, b[i]));
    }

    self.onmessage = (e) => {
      const { code, functionName, testCases, argTransform, resultTransform } = e.data;
      let fn;
      try {
        // eslint-disable-next-line no-new-func
        fn = new Function(\`\${code}\\nreturn typeof \${functionName} === "function" ? \${functionName} : null;\`)();
        if (typeof fn !== "function") {
          throw new Error(\`No function named "\${functionName}" was found.\`);
        }
      } catch (err) {
        self.postMessage({ compileError: err.message });
        return;
      }

      const results = testCases.map((tc, index) => {
        try {
          const args = applyArgTransform(tc.args, argTransform);
          const raw = fn(...args);
          const actual = applyResultTransform(raw, resultTransform);
          const pass = compareResult(actual, tc.expected, tc.unordered);
          return { index, pass, actual };
        } catch (err) {
          return { index, pass: false, error: err.message };
        }
      });

      self.postMessage({ results });
    };
  `;
}
