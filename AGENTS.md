# Repository Guidelines

## Project Structure & Module Organization
This repo is a Medusa storefront built with Next.js 15, TypeScript, and Tailwind. Route entrypoints live in `src/app`, with country-aware routes under `src/app/[countryCode]` and route groups such as `(main)` and `(checkout)`. Reusable business features live in `src/modules/<feature>` (`cart`, `products`, `checkout`, `account`, etc.), usually split into `components/` and `templates/`. Shared SDK setup, data loaders, hooks, and utilities live in `src/lib`. Global styles are in `src/styles/globals.css`; shared types are in `src/types`.

## Build, Test, and Development Commands
Use Bun (`packageManager: bun@1.3.5`).

- `bun install` — install dependencies.
- `bun run dev` — start the dev server on `http://localhost:8000`.
- `bun run build` — create a production build.
- `bun run start` — serve the production build on port `8000`.
- `bun run lint` — run ESLint via Next.js.
- `bun run analyze` — build with bundle analysis enabled.
- `bun run docker:up` / `bun run docker:down` — start or stop the local Docker stack.

For local work, run a Medusa backend on `http://localhost:9000` and copy `.env.template` to a local env file before starting.

## Coding Style & Naming Conventions
Follow the existing TypeScript/React style: 2-space indentation, no semicolons, double quotes, and trailing commas where valid in ES5 (`.prettierrc`). ESLint extends `next/core-web-vitals`. Use PascalCase for React component names, camelCase for variables/functions, and kebab-case for module folders and filenames (for example, `product-actions`, `localized-client-link`). Prefer colocated `index.tsx` entry files and existing path aliases such as `@lib/*` and `@modules/*`.

## Testing Guidelines
This repository currently has no first-party `test` script or committed `*.test`/`*.spec` files. Until a test runner is added, treat `bun run lint` and `bun run build` as the minimum pre-PR checks. If you add automated tests, colocate them with the feature they cover and use `*.test.ts` or `*.test.tsx`.

## Commit & Pull Request Guidelines
Recent history follows short conventional commits such as `feat:`, `fix:`, and `chore:`, sometimes with issue references like `(#560)`. Keep commit messages imperative and scoped, e.g. `fix: sync cart locale`. PRs should summarize the user-facing change, link the related issue, note any env/config updates, and include screenshots or recordings for storefront UI changes.

## Configuration Tips
Use `.env.template` as the source of truth for required variables. Keep real keys and local overrides out of version control, and document any new environment variable in both `.env.template` and the PR description.
