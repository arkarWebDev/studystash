# Stats & Sidebar Spec

## Overview

Move the last parts of the dashboard off `src/lib/mock-data.ts`: the review banner and the sidebar. After this spec, the whole dashboard reads from the Neon database and the mock data file is no longer used.

Follows @context/features/dashboard-collections-spec.md and @context/features/dashboard-items-spec.md: use the same patterns and the same `getCurrentUserId()` helper.

## Requirements

### 1. Query functions

Add to the existing files in `src/lib/queries/`:

| File | Function | Returns |
| --- | --- | --- |
| `item-types.ts` (new) | `getSidebarItemTypes(userId)` | All 8 system types (ordered as in the seed table) with the user's item count for each |
| `collections.ts` | `getFavoriteCollections(userId)` | Favorite collections, by name |
| `collections.ts` | `getRecentCollections(userId, 5)` | Reuse the existing function with a limit of 5 (it already returns the dominant type) |
| `review.ts` (new) | `getReviewSummary(userId)` | `{ cardsDueToday, reviewStreak }` |
| `current-user.ts` | `getCurrentUser()` | `{ name, email, image, isPro }` for the user area |

Rules:

- Every query filters by `userId`; system types are the only rows with `userId: null`
- Count items per type with **one** `groupBy` (or `_count`), not one query per type
- **Cards due today** = `FlashcardReview` rows with `dueDate` before the end of today in the user's `timezone`
- **Streak:** show `reviewStreak` only if `lastReviewedAt` is today or yesterday in the user's timezone; otherwise show 0
- Typed return values (no `any`)

### 2. Main area stats

- **Review banner:** "X cards due today" and the streak from `getReviewSummary`; keep the "You're all caught up" state when 0
- The four stats cards were already moved in the collections and items specs. Check that none of them still import mock data.

### 3. Sidebar (keep the current design)

**Review link**
- Badge with `cardsDueToday`, hidden when 0

**Item types**
- All 8 system types with their Lucide icon (from `src/lib/type-icons.ts`) in the type color
- Each links to `/items/[slug]` (e.g. `/items/notes`, `/items/flashcards`) — use the plural `slug`, not the type name
- Show the item count; `file` and `image` keep their "Pro" badge

**Favorite collections**
- Star icon for each, linking to `/collections/[id]`
- Section hidden when there are none

**Recent collections**
- The 5 most recently updated collections, linking to `/collections/[id]`
- Each shows a **colored circle** in its dominant type's color (neutral gray if empty)
- **"View all collections"** link under the list → `/collections`

**User area**
- Avatar (initials fallback), name and email from `getCurrentUser()`; small "Pro" badge if `isPro`

### 4. Data flow

- Fetch the sidebar data in the server layout (`src/app/(app)/layout.tsx`) and pass plain props down
- Only the toggle, mobile drawer and user dropdown stay client components
- Mobile drawer and desktop rail show the same data

### 5. Clean up

- Remove every remaining import of `src/lib/mock-data.ts`
- **Ask before deleting** `mock-data.ts`; it may still be useful for tests or Storybook

## Out of Scope

- The `/items/[slug]`, `/collections` and `/review` pages (links can 404 for now)
- Authentication and sign out
- Custom item types in the sidebar
- Any schema change or migration

## Acceptance Criteria

- [ ] The review banner and sidebar badge show the 10 seeded due cards and the 4-day streak
- [ ] The sidebar lists all 8 types with icons, colors and correct counts, linking to `/items/[slug]`
- [ ] Favorite collections show star icons; recent collections show colored circles that match their dashboard cards
- [ ] "View all collections" links to `/collections`
- [ ] The user area shows the demo user
- [ ] No file imports `mock-data.ts`
- [ ] No N+1 queries, and every query is scoped by `userId`
- [ ] Works in the desktop rail and the mobile drawer, dark and light mode
- [ ] `npm run lint` and `npm run build` pass

## References

- @src/lib/queries/collections.ts — patterns to follow
- @src/lib/queries/items.ts
- @context/features/dashboard-phase-2-spec.md — current sidebar design
- @context/project-overview.md — streak and due-date rules (SM-2 section)
- @context/coding-standards.md
