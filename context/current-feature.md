# Current Feature

## Status

Completed

## Goals

## Requirements

## Notes

## History

- 2026-11-05 — feature/dashboard-phase-1 — shadcn/ui setup, dark-first theme with item type color tokens, `/dashboard` route and app layout, top bar with logo and project name, sidebar/main placeholders
- 2026-11-05 — feature/dashboard-phase-2 — sidebar with review link and due badge, item types with colors and counts, favorite and recent collections, user menu with theme toggle; collapsible rail on desktop, drawer on mobile, active link highlight
- 2026-11-05 — feature/dashboard-phase-3 — dashboard main area: review banner with streak, stats cards, upcoming exam countdowns, recent collections tinted by dominant type, pinned and recent item cards with type-colored borders; mobile responsive fixes
- 2026-11-11 — feature/database-setup — Prisma 7.10 + Neon setup: `prisma7.config.ts` (unpooled URL for CLI), full schema with Auth.js, core and spaced repetition models, `init` migration applied to dev branch, `PrismaNeon` client in `src/lib/db.ts` (pooled URL), idempotent seed for 8 system item types, `db:*` scripts
- 2026-11-11 — feature/seed-data — seed always upserts 8 system types; with `SEED_DEMO=true` (blocked in production) recreates demo user `demo@studystash.io` (bcryptjs), 5 collections, 33 items, 8 tags, 15 flashcard reviews (10 due today) and 22 SM-2 review logs backing a 4-day streak, in one transaction; typed data in `prisma/seed-data/demo.ts`
- 2026-11-13 — feature/dashboard-collections — dashboard recent collections, collection stats and upcoming exams load from the database: `getCurrentUserId` (demo user until auth), `getRecentCollections` (one query, no N+1), `getCollectionStats` and `getUpcomingExams` (user's timezone) in `src/lib/queries/`; pure `getDominantType` / `summarizeTypes` (tie goes to the most recently updated item, empty collection falls back to `defaultType`); shared types in `src/types/collection.ts`; empty state and `dashboard/loading.tsx` skeletons; item stats and items stay on mock data
