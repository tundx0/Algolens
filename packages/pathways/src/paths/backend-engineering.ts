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
