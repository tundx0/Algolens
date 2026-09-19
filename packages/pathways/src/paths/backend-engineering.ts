import type { PathwayDefinition } from "../types";

export const backendEngineering: PathwayDefinition = {
  id: "backend-engineering",
  title: "Backend Engineering",
  tagline: "The way of the server",
  description:
    "A project-based road from first principles to a deployed, production-shaped service. Every stage ends with something running that you built — no tutorials to copy, only briefs to fulfill. Walk it in order: each project leans on the muscles the previous one built.",
  stages: [
    {
      id: "shu",
      kanji: "守",
      romaji: "shu",
      name: "Follow the form",
      philosophy:
        "Obey the form exactly. Repetition builds the instincts that improvisation later relies on. In this stage you build small things completely, by hand, without frameworks doing the thinking for you.",
      steps: [
        {
          id: "request-lifecycle",
          kind: "reading",
          title: "Trace a request by hand",
          description:
            "Before writing a server, be able to narrate one. Write down — on paper or in a doc — every step between typing a URL and seeing a page: DNS, TCP, TLS, the HTTP request line, headers, the response, rendering. Then explain where a backend lives in that chain and what it can and cannot see. When you can tell the story without looking anything up, this step is done.",
        },
        {
          id: "hash-maps",
          kind: "practice",
          title: "Hash maps: the backend's favorite data structure",
          description:
            "Session stores, caches, header lookups, database indexes — the backend runs on O(1) lookups. Prove the instinct on the classic pairing problem.",
          exerciseId: "two-sum",
        },
        {
          id: "kv-store",
          kind: "project",
          title: "Project: a key-value store CLI",
          description:
            "Persistence without a database — the foundation every database is built on.",
          project: {
            brief:
              "Build a command-line key-value store: `kv set <key> <value>`, `kv get <key>`, `kv delete <key>`, `kv list`. Data must survive between runs by persisting to a single file on disk. Corrupting the store on a crash mid-write is the classic failure — write to a temp file and rename it into place so a write either fully lands or never happened.",
            scaffold:
              "One shape that works: keep the whole store as an in-memory map while the process runs, and treat the file on disk as a snapshot you rewrite completely on every mutation — you don't need incremental file edits at this size. On startup, read the file (if it exists) into the map; a line-oriented format like `key\\tvalue\\n` per entry is enough, as long as you escape or length-prefix keys/values that might contain the delimiter. On every `set`/`delete`, write the *entire* updated map to a new temp file in the same directory, then use your language's atomic rename (`os.rename` / `fs.renameSync`) to swap it into place — the OS guarantees the rename itself is atomic, so a crash mid-write leaves the old file untouched. For the CLI, plain positional-argument parsing off `process.argv` / `sys.argv` is plenty; you don't need a CLI framework for this.",
            acceptanceCriteria: [
              "set / get / delete / list all work across separate process runs",
              "Killing the process mid-write never corrupts existing data (atomic write via temp file + rename)",
              "Keys and values containing spaces, quotes, and unicode round-trip correctly",
              "`get` on a missing key exits non-zero with a clear message",
            ],
            estimatedHours: 4,
          },
        },
        {
          id: "http-from-scratch",
          kind: "project",
          title: "Project: HTTP from a raw socket",
          description:
            "Frameworks hide the protocol. Build one server without them so nothing about HTTP is ever mysterious again.",
          project: {
            brief:
              "Using only your language's TCP socket API — no HTTP library, no framework — accept a connection, read the request bytes, parse the request line and headers yourself, and route two endpoints: `GET /health` returning `{\"ok\":true}` and `POST /echo` returning the request body back as JSON. Set Content-Type and Content-Length correctly. Test it with curl and with a real browser.",
            scaffold:
              "The shape: open a TCP listening socket (`net.createServer` in Node, `socket.socket(...)` + `bind`/`listen` in Python) and accept connections in a loop. For each connection, read bytes until you've seen the blank line that ends the headers (`\\r\\n\\r\\n`) — a buffered read-until-delimiter, not a single `read()` call, since the bytes can arrive in more than one chunk. Split the first line on spaces to get method/path/version, then split each following header line on the first `: `. To respond, write bytes back on the same socket: a status line (`HTTP/1.1 200 OK\\r\\n`), header lines, a blank line, then the body — compute `Content-Length` from the body's *byte* length, not its character length, so multi-byte UTF-8 doesn't break it. Close the connection after responding; you don't need keep-alive for this exercise. Look up your language's raw socket/TCP API specifically — not an HTTP client library.",
            acceptanceCriteria: [
              "Parses method, path, and headers from raw bytes — no HTTP library anywhere",
              "GET /health and POST /echo work from curl and a browser",
              "Correct Content-Length on every response (verify with curl -v)",
              "Malformed requests get a 400, unknown paths get a 404 — the server never crashes on bad input",
            ],
            estimatedHours: 6,
          },
        },
      ],
    },
    {
      id: "ha",
      kanji: "破",
      romaji: "ha",
      name: "Break the form",
      philosophy:
        "Adapt what you practiced to problems that no longer fit the template. Real frameworks and real databases enter here — but you now know what they are doing underneath.",
      steps: [
        {
          id: "trees-as-indexes",
          kind: "visualize",
          title: "Why database indexes are trees",
          description:
            "A database index is a search tree kept sorted so lookups stay logarithmic. Watch insertion keep order, then watch AVL rotations buy the balance that makes query times predictable.",
          algorithmId: "bst-insert",
        },
        {
          id: "dependency-order",
          kind: "practice",
          title: "Dependency graphs are everywhere",
          description:
            "Migrations, build steps, service startup order — all the same problem: can these dependencies be satisfied, and in what order? Solve it once as a cycle-detection problem and you'll recognize it forever.",
          exerciseId: "course-schedule",
        },
        {
          id: "rest-api",
          kind: "project",
          title: "Project: a REST API with a real database",
          description:
            "The bread-and-butter service, done properly end to end.",
          project: {
            brief:
              "Build a REST API for a small domain you pick (bookmarks, recipes, workouts). Use a real relational database (SQLite is fine) with a schema you design. Full CRUD, input validation with helpful error messages, a consistent JSON error envelope, and cursor- or offset-based pagination on the list endpoint. Ship it with integration tests that run against a real (temporary) database, not mocks.",
            acceptanceCriteria: [
              "CRUD endpoints with a designed schema and at least one relation between tables",
              "Invalid input returns 422 with per-field error messages; errors share one envelope shape",
              "List endpoint is paginated and documents its parameters",
              "Integration tests cover the happy path and the main failure paths, running against a real database",
            ],
            estimatedHours: 10,
          },
        },
        {
          id: "transactions-and-races",
          kind: "project",
          title: "Project: fix the race condition you didn't know you had",
          description:
            "Two requests, one shared row, no locking — this bug is invisible until real traffic arrives. Reproduce it on purpose, then fix it properly.",
          project: {
            brief:
              "Add an endpoint to your REST API that mutates a shared counter on an existing row — something like `POST /items/:id/decrement-stock` or a points transfer between two records. First reproduce the bug: fire a burst of concurrent requests at it (a small script, 50 at once) and show the final value is wrong — a classic lost update from an unguarded read-modify-write. Then fix it using your database's own atomicity (a single atomic `UPDATE ... SET stock = stock - 1 WHERE id = ?` is safe on its own; a `SELECT` followed by a separate `UPDATE` is not — know which one you're doing and why). Re-run the same burst test and prove the final value is now always correct.",
            acceptanceCriteria: [
              "A load script demonstrates the race condition before the fix (wrong final value, captured as evidence)",
              "The fix uses the database's own atomicity or an explicit transaction with correct locking — not an in-process mutex, which doesn't work once you run more than one server instance",
              "The same load script proves the final value is correct after the fix",
              "README explains, in your own words, exactly why the original code was wrong",
            ],
            estimatedHours: 5,
          },
        },
        {
          id: "auth",
          kind: "project",
          title: "Project: authentication done right",
          description:
            "The feature every service needs and most tutorials teach badly.",
          project: {
            brief:
              "Add signup, login, and logout to your REST API. Hash passwords with argon2 or bcrypt — never anything homemade. Issue an httpOnly session cookie backed by a sessions table, so a user can see their active sessions and revoke all of them at once (log out everywhere). Protect the CRUD routes so users only touch their own data. Write down, in the README, why you chose sessions over JWTs or vice versa — the reasoning matters more than the choice.",
            acceptanceCriteria: [
              "Passwords hashed with argon2/bcrypt; plaintext never stored or logged",
              "httpOnly, Secure, SameSite cookie; no tokens in localStorage",
              "Sessions persisted server-side; 'log out everywhere' revokes them all",
              "Route protection enforced server-side — verified by a test that tries to read another user's data",
              "README explains the sessions-vs-JWT decision honestly",
            ],
            estimatedHours: 8,
          },
        },
        {
          id: "priority-queues",
          kind: "visualize",
          title: "Priority queues under the hood",
          description:
            "Job schedulers, retry backoff, load balancers — anything that answers \"what's next?\" efficiently is a heap. Watch sift-down maintain the invariant that makes extract-max O(log n).",
          algorithmId: "heap-sort",
        },
        {
          id: "job-queue",
          kind: "project",
          title: "Project: a background job queue",
          description:
            "The moment a request does slow work inline, you need this. Every real backend grows one.",
          project: {
            brief:
              "Build a job queue on top of your database: an enqueue function any endpoint can call, and a separate worker process that claims jobs, runs them, and records the outcome. Failed jobs retry with exponential backoff up to a max attempts limit, then land in a dead-letter state you can inspect. Two workers running at once must never both claim the same job (use a transactional claim — SELECT ... FOR UPDATE SKIP LOCKED or your database's equivalent). Demonstrate with a job type that flakily fails 50% of the time.",
            acceptanceCriteria: [
              "Worker runs as a separate process from the API",
              "Retries use exponential backoff and respect a max-attempts cap; exhausted jobs are dead-lettered, not lost",
              "Running two workers concurrently processes each job exactly once (prove it with a counter)",
              "A crashed worker's claimed job is eventually picked up again",
            ],
            estimatedHours: 10,
          },
        },
      ],
    },
    {
      id: "ri",
      kanji: "離",
      romaji: "ri",
      name: "Leave the form",
      philosophy:
        "Design from first principles — the form is now yours. In this stage nobody hands you the shape of the solution; the brief describes a problem and a bar to clear.",
      steps: [
        {
          id: "caching",
          kind: "project",
          title: "Project: cache-aside with Redis",
          description:
            "Every read hitting the database doesn't scale. Put a cache in front of the hottest read path — and handle the part everyone gets wrong: invalidation.",
          project: {
            brief:
              "Add Redis in front of one or more read-heavy GET endpoints in your REST API, using the cache-aside pattern: on a read, check the cache first; on a miss, read from the database, populate the cache with a TTL, then return it. On any write that changes that data, invalidate (or update) the corresponding cache key(s) in the same request — a stale cache is worse than no cache. Measure it: load-test a hot endpoint cold, then warm, and report the latency difference. Then write a test that updates a resource and immediately re-reads it, proving you never see a stale value.",
            acceptanceCriteria: [
              "Cache-aside pattern implemented on at least one real read path, with a TTL",
              "Every write path that changes cached data invalidates or updates the relevant key(s) in the same request",
              "A test proves an update is immediately visible on the next read — no stale-cache window",
              "Latency numbers (or a chart) showing cold-cache vs warm-cache response time on the same endpoint",
            ],
            estimatedHours: 6,
          },
        },
        {
          id: "rate-limit-intuition",
          kind: "practice",
          title: "Interval reasoning for rate limits",
          description:
            "Sliding windows, overlapping request bursts, merged quota periods — rate limiting is interval arithmetic. Sharpen it on the canonical merge problem before building the real thing.",
          exerciseId: "merge-intervals",
        },
        {
          id: "rate-limiter",
          kind: "project",
          title: "Project: a rate limiter you can prove works",
          description:
            "Middleware that protects everything behind it — and a claim you have to back with numbers.",
          project: {
            brief:
              "Design and build rate-limiting middleware for your API supporting two strategies: token bucket and sliding window. Limits are configured per route and keyed per user (or per IP for anonymous traffic). Return 429 with Retry-After and X-RateLimit-Limit / -Remaining / -Reset headers. Then prove it: write a load script that fires 10× the limit and chart accepted-vs-rejected over time for both strategies, showing the burst behavior difference between them.",
            acceptanceCriteria: [
              "Both strategies implemented behind one middleware interface",
              "Correct 429 + Retry-After + X-RateLimit-* headers",
              "Per-key isolation: one user hitting the limit never affects another",
              "Load-test evidence (numbers or a chart) showing the two strategies' different burst behavior",
            ],
            estimatedHours: 8,
          },
        },
        {
          id: "observability",
          kind: "project",
          title: "Project: make the system debuggable in production",
          description:
            "You can't SSH in and attach a debugger to a service that's already crash-looping at 3am. Logs and metrics are the only view you get — make them good enough to actually use.",
          project: {
            brief:
              "Add structured (JSON) logging to your API and your job-queue worker, with a request ID generated per incoming request and threaded through every log line it produces — including inside the worker, if that request enqueued a job. Add a `/metrics` endpoint reporting at minimum: request count by status code, p50/p95 request latency, and job queue depth. Then do the real test: trigger a 500 on purpose, and using only the logs and metrics you just built — no debugger, no print statements added after the fact — find and explain exactly what happened.",
            acceptanceCriteria: [
              "Every log line is structured (JSON), not free-form text",
              "A single request ID appears on every log line caused by that request, across both the API process and the worker process",
              "/metrics reports request counts by status, p50/p95 latency, and queue depth",
              "A deliberately-triggered failure is diagnosed end-to-end using only logs/metrics, written up as a short postmortem",
            ],
            estimatedHours: 5,
          },
        },
        {
          id: "capstone",
          kind: "project",
          title: "Capstone: a URL shortener as a production service",
          description:
            "Small enough to finish, deep enough to be real. This is the step that turns the path into a portfolio piece.",
          project: {
            brief:
              "Write a one-page design doc first: endpoints, schema, short-code scheme (e.g. base62 over a sequence), how you'll keep redirects fast, and what you'll measure. Then build it: create + redirect + per-link click stats, an in-memory cache in front of the database for hot links, structured logs, and a /metrics endpoint (request counts, cache hit rate, p95 redirect latency). Containerize it with Docker and deploy it anywhere real (a VPS, Fly.io, Railway). Finish the README with an architecture section and an honest 'what I'd do differently at 100× traffic' section.",
            acceptanceCriteria: [
              "Design doc written before the code, committed to the repo",
              "Redirects served from cache on hot links — cache hit rate visible in /metrics",
              "p95 redirect latency measured and reported",
              "Deployed and reachable on the public internet, running in a container",
              "README includes architecture and a scaling retrospective",
            ],
            estimatedHours: 16,
          },
        },
      ],
    },
  ],
};
