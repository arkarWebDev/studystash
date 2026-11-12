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
- 2026-11-13 — feature/dashboard-items — dashboard pinned items, recent items and item stats load from the database: `getPinnedItems`, `getRecentItems` and `getItemStats` in `src/lib/queries/items.ts` (type and tags in the same query, `answer` never fetched); all dashboard queries in one `Promise.all`; cached `getUserTimezone` for countdowns and relative dates; pure `getItemPreview` in `src/lib/item-preview.ts` (link host, file name, first prose line of notes skipping code and tables, ~120 chars); shared icon map moved to `src/lib/type-icons.ts`; tag badges (max 3, then "+N"); "New item" empty state and item skeletons; all four stats cards now use the database, review banner still mock
- 2026-11-13 — feature/stats-sidebar — review banner and sidebar load from the database, so nothing imports `mock-data.ts` any more (file kept for tests / Storybook): `getReviewSummary` (cached; cards due before the end of today and streak shown only if last review was today or yesterday, user's timezone), `getSidebarItemTypes` (8 system types in seed order, counts via one `groupBy`), `getFavoriteCollections`, `getCurrentUser`; sidebar data fetched in `(app)/layout.tsx` behind a Suspense skeleton; type links use plural slugs, recent collections show a dominant-type color dot, "View all collections" link, user "Pro" badge; pure `getActiveStreak` in `src/lib/streak.ts`, `getEndOfDayInTimeZone` added and DST fix for `getStartOfDayInTimeZone`
