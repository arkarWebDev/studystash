# Current Feature

## Status

In Progress

## Goals

Replace the mock item data in the dashboard main area with real data from Neon via Prisma: the pinned items and recent items sections and the two item stats cards. The page looks the same; after this, all four stats cards use the database.

## Requirements

### Query functions (`src/lib/queries/items.ts`)

- [x] `getPinnedItems(userId)` — items with `isPinned`, newest `updatedAt` first
- [x] `getRecentItems(userId, limit = 10)` — latest items by `updatedAt`
- [x] `getItemStats(userId)` — `{ totalItems, favoriteItems }`
- [x] Every query filters by `userId`
- [x] `select` only the card's fields, including item type (`slug`, `name`, `icon`, `color`) in the same query (no query per item)
- [x] Queries run in parallel with `Promise.all`
- [x] Typed return values (no `any`); shared `ItemCardData` type in `src/types/item.ts`

### Preview text (`src/lib/item-preview.ts`)

- [x] Pure helper builds `preview` so the card doesn't need to know about types
- [x] note → first line of `content`, markdown stripped
- [x] flashcard → front (`content`)
- [x] formula → `content` (KaTeX only if the card already renders it)
- [x] question → `content`
- [x] link / video → host name from `url` (e.g. `youtube.com`)
- [x] file / image → `fileName`
- [x] Truncate to about 120 characters; never fetch `answer`

### Item card (keep the current design)

- [x] Border color and icon come from the item's type (`type.color`, `type.icon`)
- [x] Shared icon-name → Lucide map in `src/lib/type-icons.ts` (fallback `File`), reused in the sidebar
- [x] Keep type label, title, preview, relative time, pin and favorite indicators
- [x] Tags as small badges (max 3, then "+N")

### Dashboard page

- [x] Item queries fetched in `page.tsx` together with the collection queries, in one `Promise.all`
- [x] Pinned section hidden completely when there are none (no heading, no empty box)
- [x] Recent items empty state: short message + "New item" button (display only)
- [x] An item that is both pinned and recent appears in both sections
- [x] "Items" and "Favorite items" stats come from `getItemStats`
- [x] `loading.tsx` extended with skeleton item cards

### Clean up

- [x] Remove item imports from `mock-data.ts` in changed files

### Acceptance criteria

- [x] Pinned shows the 3 seeded pinned items; section disappears when none are pinned
- [x] Recent shows the 10 latest seeded items, newest first
- [x] Border colors and icons match each item's type
- [x] Previews follow the table (e.g. links show the host name)
- [x] Item stats match the database (Prisma Studio)
- [x] No N+1 queries; every query scoped by `userId`
- [ ] Looks the same in dark/light mode, desktop/mobile
- [x] `npm run lint` and `npm run build` pass

## Notes

- Follow the patterns in `src/lib/queries/collections.ts` and reuse `getCurrentUserId()`
- `src/lib/item-types.ts` already has the icon map (`getItemTypeIcon`) used by `ItemTypeIcon` and the sidebar; the spec asks for `src/lib/type-icons.ts` — move the map there rather than keeping two copies
- `getItemPreview` in `src/lib/dashboard.ts` already handles part of the preview logic; move it into `src/lib/item-preview.ts`
- Item cards still use the mock user's timezone for relative time; switch to the user's `timezone` from the database
- Out of scope: item drawer, item CRUD, pin / favorite toggles, sidebar (stats-sidebar spec), any schema change or migration
- Spec: @context/features/dashboard-items-spec.md

## History

- 2026-11-05 — feature/dashboard-phase-1 — shadcn/ui setup, dark-first theme with item type color tokens, `/dashboard` route and app layout, top bar with logo and project name, sidebar/main placeholders
- 2026-11-05 — feature/dashboard-phase-2 — sidebar with review link and due badge, item types with colors and counts, favorite and recent collections, user menu with theme toggle; collapsible rail on desktop, drawer on mobile, active link highlight
- 2026-11-05 — feature/dashboard-phase-3 — dashboard main area: review banner with streak, stats cards, upcoming exam countdowns, recent collections tinted by dominant type, pinned and recent item cards with type-colored borders; mobile responsive fixes
- 2026-11-11 — feature/database-setup — Prisma 7.10 + Neon setup: `prisma7.config.ts` (unpooled URL for CLI), full schema with Auth.js, core and spaced repetition models, `init` migration applied to dev branch, `PrismaNeon` client in `src/lib/db.ts` (pooled URL), idempotent seed for 8 system item types, `db:*` scripts
- 2026-11-11 — feature/seed-data — seed always upserts 8 system types; with `SEED_DEMO=true` (blocked in production) recreates demo user `demo@studystash.io` (bcryptjs), 5 collections, 33 items, 8 tags, 15 flashcard reviews (10 due today) and 22 SM-2 review logs backing a 4-day streak, in one transaction; typed data in `prisma/seed-data/demo.ts`
- 2026-11-13 — feature/dashboard-collections — dashboard recent collections, collection stats and upcoming exams load from the database: `getCurrentUserId` (demo user until auth), `getRecentCollections` (one query, no N+1), `getCollectionStats` and `getUpcomingExams` (user's timezone) in `src/lib/queries/`; pure `getDominantType` / `summarizeTypes` (tie goes to the most recently updated item, empty collection falls back to `defaultType`); shared types in `src/types/collection.ts`; empty state and `dashboard/loading.tsx` skeletons; item stats and items stay on mock data
