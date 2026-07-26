# AlgoLens

An interactive Data Structures & Algorithms learning platform. Algorithms are
implemented as pure step-generators; a generic visualization engine plays the
steps back with a consistent motion grammar, so learners can infer what an
algorithm does from motion alone.

## Development

```sh
pnpm install
pnpm dev        # Next.js app at http://localhost:3000
pnpm typecheck  # strict TypeScript across all packages
pnpm build
```

## Structure

- `apps/web` — Next.js app (App Router)
- `packages/viz-engine` — framework-agnostic step player + state types
- `packages/algorithms` — algorithm definitions (pure step generators)
- `packages/ui` — design tokens and shared components
- `packages/config` — shared tsconfig / eslint / tailwind preset

Adding an algorithm means adding one file in `packages/algorithms/src` and
registering it in `registry.ts` — the engine, controls, and UI shell are never
touched.
