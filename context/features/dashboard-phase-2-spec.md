# Dashboard UI — Phase 2 Spec

## Overview

Phase 2 of 3 for the StudyStash dashboard layout. This phase replaces the sidebar placeholder with the real sidebar. Use the mock data from `src/lib/mock-data.ts`, imported directly, until the database is set up.

## Design Reference (optional)

> If a UI design exists at @context/screenshots/, match its sidebar layout.
> If it does not exist, follow the **Layout** section under UI/UX in @context/project-overview.md.

## Requirements

### 1. Sidebar sections (top to bottom)

1. **Review**
   - Link to `/review` with a `Brain` or `Repeat` icon
   - Badge showing the number of flashcards due today (hidden when 0)
2. **Item types**
   - All 8 system types, each linking to `/items/[slug]` (e.g. `/items/notes`, `/items/flashcards`, `/items/formulas`)
   - Each row shows the type's Lucide icon in its type color, the plural label and the item count
   - `file` and `image` show a small "Pro" badge
3. **Favorite collections**
   - Collections where `isFavorite` is true, linking to `/collections/[id]`
   - Hidden when there are none
4. **Recent collections**
   - The 5 most recently updated collections, linking to `/collections/[id]`
   - Link to "View all" → `/collections`
5. **User area (bottom, pinned)**
   - Avatar (initials fallback), name and email
   - Dropdown menu: Settings, theme toggle, Sign out (display only)

### 2. Collapsing

- Toggle button in the top bar (`PanelLeft` icon) opens and closes the sidebar
- **Desktop:** collapses to an icon-only rail; labels show as tooltips
- **Mobile (< 768px):** the sidebar is always a drawer (shadcn `Sheet`) that slides in from the left and closes when a link is clicked
- Highlight the active link based on the current path

### 3. Component structure

- `src/components/sidebar/Sidebar.tsx`
- `src/components/sidebar/SidebarSection.tsx`
- `src/components/sidebar/SidebarLink.tsx`
- `src/components/sidebar/UserMenu.tsx`
- Keep data fetching in the server component; only the toggle, mobile drawer and dropdown are client components

## Out of Scope

- The `/review`, `/items/[slug]` and `/collections` pages themselves (links can 404 for now)
- Real sign out or theme persistence beyond `next-themes`

## Acceptance Criteria

- [ ] All sections render from mock data
- [ ] Type icons and colors match the table in @context/project-overview.md
- [ ] Sidebar collapses on desktop and is a drawer on mobile
- [ ] Active link is highlighted
- [ ] Keyboard accessible, with `aria-label`s on icon-only buttons
- [ ] `npm run lint` and `npm run build` pass

## References

- @context/project-overview.md
- @context/coding-standards.md
- @src/lib/mock-data.ts
- @context/screenshots/dashboard-ui-main.png *(optional)*
- @context/features/dashboard-phase-1-spec.md
- @context/features/dashboard-phase-3-spec.md
