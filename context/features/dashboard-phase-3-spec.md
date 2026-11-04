# Dashboard UI — Phase 3 Spec

## Overview

Phase 3 of 3 for the StudyStash dashboard layout. This phase replaces the main area placeholder with the real dashboard content. Use the mock data from `src/lib/mock-data.ts`, imported directly, until the database is set up.

## Design Reference (optional)

> If a UI design exists at @context/screenshots/, match its main area layout.
> If it does not exist, follow the **Layout** section under UI/UX in @context/project-overview.md.

## Requirements

Main area sections, top to bottom:

### 1. Review banner

- "**X cards due today**" with a **Start Review** button linking to `/review`
- Shows the current review streak (e.g. 🔥 5-day streak)
- When nothing is due: "You're all caught up" with no button

### 2. Stats cards (4)

A row of 4 cards (2 × 2 on mobile), each with an icon, a label and a number:

| Card | Icon | Value |
| --- | --- | --- |
| Items | `Library` | Total items |
| Collections | `FolderOpen` | Total collections |
| Favorite items | `Star` | Items with `isFavorite` |
| Favorite collections | `Heart` | Collections with `isFavorite` |

### 3. Upcoming exams

- Collections with an `examDate` in the future, nearest first (max 3)
- Each shows the collection name and a countdown ("in 12 days", "Tomorrow", "Today")
- Hidden when there are none

### 4. Recent collections

- Grid of the 6 most recently updated collections (3 columns on desktop, 2 on tablet, 1 on mobile)
- Each card's **background** is tinted with the color of the type the collection contains most of
- Card shows: name, description (1 line, truncated), item count, small icons of the types it contains, and a star if favorite
- Links to `/collections/[id]`; "View all" link → `/collections`

### 5. Pinned items

- Items with `isPinned`, shown as item cards
- Hidden when there are none

### 6. Recent items

- The 10 most recently updated items, newest first

### Item card (shared by sections 5 & 6)

- **Border** color matches the item's type color
- Type icon, title, a short content preview (flashcard front, formula, URL host for links / videos, file name for files)
- Relative time ("2 hours ago"), pin and favorite indicators
- Clicking does nothing yet (the item drawer comes later)

### Component structure

- `src/components/dashboard/ReviewBanner.tsx`
- `src/components/dashboard/StatsCards.tsx`
- `src/components/dashboard/UpcomingExams.tsx`
- `src/components/collections/CollectionCard.tsx`
- `src/components/items/ItemCard.tsx`
- Put data selection helpers (e.g. `getRecentItems`, `getDominantType`) in `src/lib/` so they can be swapped for Prisma queries later

## Out of Scope

- Item drawer, creating or editing items
- Review mode
- Real database queries

## Acceptance Criteria

- [ ] All sections render from mock data, in the order above
- [ ] Collection card backgrounds and item card borders use the type color tokens
- [ ] Empty sections are hidden (or show a friendly empty state for the review banner)
- [ ] Layout works on mobile, tablet and desktop, in dark and light mode
- [ ] `npm run lint` and `npm run build` pass

## References

- @context/project-overview.md
- @context/coding-standards.md
- @src/lib/mock-data.ts
- @context/screenshots/dashboard-ui-main.png *(optional)*
- @context/features/dashboard-phase-1-spec.md
- @context/features/dashboard-phase-2-spec.md
