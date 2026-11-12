# Current Feature

## Status

In Progress

## Goals

Move the last parts of the dashboard off `src/lib/mock-data.ts`: the review banner and the sidebar. After this, the whole dashboard reads from Neon and the mock data file is no longer imported anywhere.

## Requirements

### Query functions (`src/lib/queries/`)

- [x] `item-types.ts` (new) — `getSidebarItemTypes(userId)`: all 8 system types in seed order, each with the user's item count
- [x] `collections.ts` — `getFavoriteCollections(userId)`: favorite collections, by name
- [x] `collections.ts` — reuse `getRecentCollections(userId, 5)` for the sidebar (already returns the dominant type)
- [x] `review.ts` (new) — `getReviewSummary(userId)`: `{ cardsDueToday, reviewStreak }`
- [x] `current-user.ts` — `getCurrentUser()`: `{ name, email, image, isPro }`
- [x] Every query filters by `userId`; system types are the only rows with `userId: null`
- [x] Item counts per type with **one** `groupBy` (or `_count`), not one query per type
- [x] Cards due today = `FlashcardReview` rows with `dueDate` before the end of today in the user's `timezone`
- [x] Streak = `reviewStreak` only if `lastReviewedAt` is today or yesterday in the user's timezone, otherwise 0
- [x] Typed return values (no `any`)

### Main area stats

- [x] Review banner: "X cards due today" and streak from `getReviewSummary`; keep "You're all caught up" at 0
- [x] Confirm none of the four stats cards still import mock data

### Sidebar (keep the current design)

- [x] Review link badge with `cardsDueToday`, hidden at 0
- [x] All 8 system types with Lucide icon (`src/lib/type-icons.ts`) in the type color
- [x] Type links use the plural slug: `/items/[slug]` (e.g. `/items/notes`)
- [x] Item count per type; `file` and `image` keep the "Pro" badge
- [x] Favorite collections with star icon → `/collections/[id]`; section hidden when none
- [x] Recent collections: 5 most recently updated → `/collections/[id]`, each with a colored circle in its dominant type color (neutral gray if empty)
- [x] "View all collections" link under the list → `/collections`
- [x] User area: avatar (initials fallback), name, email from `getCurrentUser()`; small "Pro" badge if `isPro`

### Data flow

- [x] Fetch sidebar data in the server layout `src/app/(app)/layout.tsx` and pass plain props down
- [x] Only the toggle, mobile drawer and user dropdown stay client components
- [x] Mobile drawer and desktop rail show the same data

### Clean up

- [x] Remove every remaining import of `src/lib/mock-data.ts`
- [x] **Ask before deleting** `mock-data.ts` (kept)

### Acceptance criteria

- [ ] Review banner and sidebar badge show the 10 seeded due cards and the 4-day streak
- [x] Sidebar lists all 8 types with icons, colors and correct counts, linking to `/items/[slug]`
- [x] Favorites show star icons; recent collections show colored circles matching their dashboard cards
- [x] "View all collections" links to `/collections`
- [x] User area shows the demo user
- [x] No file imports `mock-data.ts`
- [x] No N+1 queries; every query scoped by `userId`
- [ ] Works in the desktop rail and mobile drawer, dark and light mode
- [x] `npm run lint` and `npm run build` pass

## Notes

- Follow the patterns in `src/lib/queries/collections.ts` and `items.ts`; reuse `getCurrentUserId()` and the cached `getUserTimezone()`
- `getReviewSummary` in `src/lib/dashboard.ts` is the mock version; replace it with the query and drop it from that file
- `cacheComponents` is on: database reads in the layout must sit inside a `<Suspense>` boundary, or the build fails. Wrap the sidebar data in Suspense with a skeleton fallback so the top bar and main area aren't blocked
- `getRecentCollections` is reused, so the sidebar and dashboard may fetch collections twice per request; acceptable for now, wrap in `React.cache` if needed
- Seed data was created on 2026-11-11; due cards and the streak depend on `dueDate` / `lastReviewedAt`, so re-run the seed if the expected 10 due / 4-day streak no longer show
- Out of scope: `/items/[slug]`, `/collections` and `/review` pages (links can 404), auth and sign out, custom item types in the sidebar, any schema change or migration
- Spec: @context/features/stats-sidebar-spec.md

## History

- 2026-11-05 — feature/dashboard-phase-1 — shadcn/ui setup, dark-first theme with item type color tokens, `/dashboard` route and app layout, top bar with logo and project name, sidebar/main placeholders
- 2026-11-05 — feature/dashboard-phase-2 — sidebar with review link and due badge, item types with colors and counts, favorite and recent collections, user menu with theme toggle; collapsible rail on desktop, drawer on mobile, active link highlight
- 2026-11-05 — feature/dashboard-phase-3 — dashboard main area: review banner with streak, stats cards, upcoming exam countdowns, recent collections tinted by dominant type, pinned and recent item cards with type-colored borders; mobile responsive fixes
- 2026-11-11 — feature/database-setup — Prisma 7.10 + Neon setup: `prisma7.config.ts` (unpooled URL for CLI), full schema with Auth.js, core and spaced repetition models, `init` migration applied to dev branch, `PrismaNeon` client in `src/lib/db.ts` (pooled URL), idempotent seed for 8 system item types, `db:*` scripts
- 2026-11-11 — feature/seed-data — seed always upserts 8 system types; with `SEED_DEMO=true` (blocked in production) recreates demo user `demo@studystash.io` (bcryptjs), 5 collections, 33 items, 8 tags, 15 flashcard reviews (10 due today) and 22 SM-2 review logs backing a 4-day streak, in one transaction; typed data in `prisma/seed-data/demo.ts`
- 2026-11-13 — feature/dashboard-collections — dashboard recent collections, collection stats and upcoming exams load from the database: `getCurrentUserId` (demo user until auth), `getRecentCollections` (one query, no N+1), `getCollectionStats` and `getUpcomingExams` (user's timezone) in `src/lib/queries/`; pure `getDominantType` / `summarizeTypes` (tie goes to the most recently updated item, empty collection falls back to `defaultType`); shared types in `src/types/collection.ts`; empty state and `dashboard/loading.tsx` skeletons; item stats and items stay on mock data
- 2026-11-13 — feature/dashboard-items — dashboard pinned items, recent items and item stats load from the database: `getPinnedItems`, `getRecentItems` and `getItemStats` in `src/lib/queries/items.ts` (type and tags in the same query, `answer` never fetched); all dashboard queries in one `Promise.all`; cached `getUserTimezone` for countdowns and relative dates; pure `getItemPreview` in `src/lib/item-preview.ts` (link host, file name, first prose line of notes skipping code and tables, ~120 chars); shared icon map moved to `src/lib/type-icons.ts`; tag badges (max 3, then "+N"); "New item" empty state and item skeletons; all four stats cards now use the database, review banner still mock
