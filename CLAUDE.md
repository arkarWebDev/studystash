# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Context Files

@context/project-overview.md
@context/coding-standards.md
@context/ai-interaction.md
@context/current-feature.md

## Commands

- `npm run dev` — dev server at http://localhost:3000 (also regenerates the block in `AGENTS.md`)
- `npm run build` — production build; also the main type-check, since there is no separate `tsc` script
- `npm run start` — serve the production build
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`, Next core-web-vitals + TypeScript rules)

No test framework is configured.

## Stack and setup

- Next.js 16.4 (App Router only, under `src/app/`), React 19.3, TypeScript strict mode. The `@/*` path alias maps to `./src/*`.
- The bundled Next.js docs in `node_modules/next/dist/docs/` (`01-app/`, `03-architecture/`, …) match the installed version. Use them instead of what you remember about Next.js.
- `next.config.ts` turns on `cacheComponents`, `partialPrefetching` and `experimental.agentFeedback`. With `cacheComponents` on, data fetching and caching work differently from older Next versions, so check the docs before you write data-fetching code.
- Tailwind CSS v4 runs through the `@tailwindcss/turbopack` loader set up in `next.config.ts` under `turbopack.rules`. There is no PostCSS config and no `tailwind.config` file. Tailwind is loaded with `@import "tailwindcss";` in `src/app/globals.css`, and any theme customization goes in that CSS file using `@theme`.
- Layouts and pages use the global `LayoutProps<"/">` / `PageProps<"/...">` helper types that Next generates. They are not imported.

## Current state

The create-next-app starter has been stripped down. `page.tsx` renders a single unstyled `<h1>`, `layout.tsx` has no fonts or classes, `globals.css` contains only the Tailwind import, and `public/` is empty.
