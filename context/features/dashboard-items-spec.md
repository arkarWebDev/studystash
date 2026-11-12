# Dashboard Items Spec

## Overview

Replace the mock item data in the dashboard main area with real data from the Neon database using Prisma. This covers the **pinned items** and **recent items** sections and the two item stats cards. The page should look the same as it does now. The only difference is that this data now comes from the database instead of `src/lib/mock-data.ts`.

Follows @context/features/dashboard-collections-spec.md: use the same patterns, the same `getCurrentUserId()` helper and the same folder.

## Requirements

### 1. Query functions

Create `src/lib/queries/items.ts` (not `src/lib/db/`, for the same reason as the collections spec):

| Function | Returns |
| --- | --- |
| `getPinnedItems(userId)` | Items with `isPinned`, newest `updatedAt` first |
| `getRecentItems(userId, limit = 10)` | The latest items by `updatedAt` |
| `getItemStats(userId)` | `{ totalItems, favoriteItems }` |

Rules:

- Every query filters by `userId`
- Use `select` with only the fields the card needs, including the item type (`slug`, `name`, `icon`, `color`) in the same query (no query per item)
- Run the queries in parallel with `Promise.all`
- Typed return values (no `any`); put shared types in `src/types/item.ts`

```ts
interface ItemCardData {
  id: string;
  title: string;
  contentType: ContentType;
  preview: string | null;
  isPinned: boolean;
  isFavorite: boolean;
  updatedAt: Date;
  type: { slug: string; name: string; icon: string; color: string };
  tags: string[];
}
```

### 2. Preview text

Build `preview` with a pure helper in `src/lib/item-preview.ts`, so the card doesn't need to know about types:

| Type | Preview |
| --- | --- |
| note | First line of `content`, markdown stripped |
| flashcard | Front (`content`) |
| formula | `content` (rendered with KaTeX if the card already does) |
| question | `content` |
| link / video | Host name from `url` (e.g. `youtube.com`) |
| file / image | `fileName` |

Truncate to about 120 characters. Never fetch `answer`; the card doesn't show it.

### 3. Item card (keep the current design)

- **Border** color and **icon** come from the item's type (`type.color`, `type.icon`)
- Map the icon name to a Lucide component with a shared map in `src/lib/type-icons.ts` (fallback: `File`), and reuse the map in the sidebar
- Show everything already on the card: type label, title, preview, relative time, pin and favorite indicators
- Show the item's tags as small badges (max 3, then "+N")

### 4. Dashboard page

- Fetch in the server component (`page.tsx`) along with the collection queries, all in one `Promise.all`
- **Pinned items:** hidden completely when there are none (no heading, no empty box)
- **Recent items:** if the user has no items, show a short message with a "New item" button (display only)
- If an item is both pinned and recent, it appears in both sections (same as now)
- **Stats cards:** "Items" and "Favorite items" now come from `getItemStats`. After this spec, all four stats cards use the database.
- Extend `loading.tsx` with skeleton item cards

### 5. Clean up

- Remove the item imports from `mock-data.ts` in the files you change

## Out of Scope

- Item drawer, creating, editing or deleting items
- Pin / favorite toggles
- Sidebar (see @context/features/stats-sidebar-spec.md)
- Any schema change or migration

## Acceptance Criteria

- [ ] Pinned items show the 3 seeded pinned items; the section disappears when none are pinned
- [ ] Recent items show the 10 latest seeded items, newest first
- [ ] Border colors and icons match each item's type
- [ ] Previews follow the table (e.g. links show the host name)
- [ ] Item stats match the database (check in Prisma Studio)
- [ ] No N+1 queries, and every query is scoped by `userId`
- [ ] Looks the same as before in dark and light mode, desktop and mobile
- [ ] `npm run lint` and `npm run build` pass

## References

- @context/features/dashboard-collections-spec.md — patterns to follow
- @src/lib/queries/collections.ts
- @context/coding-standards.md
- @context/features/seed-data-spec.md — demo data to expect