# Dashboard Collections Spec

## Overview

Replace the mock collection data in the dashboard main area with real data from the Neon database using Prisma. The page should look the same as it does now. The only difference is that the recent collections grid, the collection stats and the upcoming exams now come from the database instead of `src/lib/mock-data.ts`.

Don't touch the pinned and recent items sections yet. They move to the database in a later spec.

## Before You Start

- The database is set up (@context/features/database-setup-spec.md) and seeded with demo data (`SEED_DEMO=true`, @context/features/seed-data-spec.md)
- Auth isn't built yet, so there is no signed-in user. Until then, load the demo user (`demo@studystash.io`) in one helper and use its `id` for every query. Replace this helper when auth is added.

```ts
// src/lib/queries/current-user.ts
export async function getCurrentUserId(): Promise<string | null>
```

## Requirements

### 1. Query functions

Create `src/lib/queries/collections.ts`.

> Use `src/lib/queries/`, not `src/lib/db/`. `src/lib/db.ts` (the Prisma client) already exists, and a `src/lib/db/` folder next to it makes `@/lib/db` imports ambiguous.

| Function | Returns |
| --- | --- |
| `getRecentCollections(userId, limit = 6)` | The latest collections by `updatedAt`, each with item count, dominant type and the list of types it contains |
| `getCollectionStats(userId)` | `{ totalCollections, favoriteCollections }` |
| `getUpcomingExams(userId, limit = 3)` | Collections with `examDate` today or later, nearest first |

Rules:

- Every query filters by `userId`
- Use `select` so only the fields the cards need are fetched
- Fetch everything for the grid in **one query**: no query per collection (no N+1)
- Run independent queries in parallel with `Promise.all`
- Typed return values (no `any`); put shared types in `src/types/collection.ts`

```ts
interface CollectionCardData {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  examDate: Date | null;
  itemCount: number;
  dominantType: TypeSummary | null; // null when the collection is empty
  types: TypeSummary[];             // every type in the collection, most used first
}

interface TypeSummary {
  slug: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}
```

### 2. Dominant type & type icons

- Count the items of each type in the collection (through `ItemCollection` → `Item` → `ItemType`)
- **Dominant type** = the type with the most items. On a tie, use the type of the most recently updated item.
- Card **background** is tinted with the dominant type's color (keep the current design)
- If the collection is empty, use `defaultType` if it is set; otherwise use a neutral background
- Show a small icon for **every** type in the collection, in its type color, most used first
- Put the counting logic in a pure function (`getDominantType`) in `src/lib/` so it can be unit-tested

### 3. Dashboard page

- `src/app/(app)/dashboard/page.tsx` stays a **server component** and calls the query functions directly (no API route, no `useEffect`)
- Pass plain, serializable props to `CollectionCard`, `StatsCards` and `UpcomingExams`
- **Stats cards:** "Collections" and "Favorite collections" come from the database. "Items" and "Favorite items" stay on mock data for now.
- **Upcoming exams:** from the database; the countdown uses the user's `timezone`
- **Empty state:** if the user has no collections, show a short message with a "Create collection" button (display only)
- Add `src/app/(app)/dashboard/loading.tsx` with skeleton cards matching the grid

### 4. Clean up

- Remove the collection imports from `mock-data.ts` in the files you change
- Keep the mock collections in `mock-data.ts` because the sidebar still uses them

## Out of Scope

- Items on the dashboard (pinned, recent) and item stats
- Sidebar collections (separate spec)
- Authentication
- Creating, editing or deleting collections
- Any schema change or migration

## Acceptance Criteria

- [ ] The recent collections grid shows the 5 seeded collections from the database, newest first
- [ ] Each card's background matches its dominant type (e.g. IELTS Vocabulary → flashcard purple)
- [ ] Each card shows icons for all types in that collection
- [ ] Final Exam Prep counts the items it shares with other collections
- [ ] Collection stats and upcoming exams match the database (check in Prisma Studio)
- [ ] One query for the grid (no N+1), and every query is scoped by `userId`
- [ ] Empty state and loading skeletons work
- [ ] Looks the same as before in dark and light mode, desktop and mobile
- [ ] `npm run lint` and `npm run build` pass

## References

- @context/project-overview.md — data model
- @context/coding-standards.md — data fetching, naming, types
- @context/features/dashboard-phase-3-spec.md — current card design
- @context/features/seed-data-spec.md — demo data to expect
- @src/lib/db.ts — Prisma client
