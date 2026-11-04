# Dashboard UI — Phase 1 Spec

## Overview

Phase 1 of 3 for the StudyStash dashboard layout. This phase sets up shadcn/ui, global styles, the dashboard route, the top bar and the shared mock data. The sidebar and main area are placeholders here; they get built in phases 2 and 3.

## Design Reference (optional)

> If a UI design exists at @context/screenshots/, match its layout, spacing and colors.
> If it does not exist, follow the **UI/UX** section of @context/project-overview.md (Notion / Linear style: calm, minimal, dark-first).

## Requirements

### 1. shadcn/ui setup

- Initialize shadcn/ui for Tailwind CSS v4 (`npx shadcn@latest init`)
- No `tailwind.config.*` file — all theme config goes in `src/app/globals.css` with `@theme`
- Install the components needed for all three phases:
  `button`, `input`, `card`, `badge`, `avatar`, `separator`, `sheet`, `tooltip`, `dropdown-menu`, `scroll-area`, `skeleton`, `sonner`

### 2. Global styles

- Dark mode by default (`next-themes`, `defaultTheme="dark"`), light mode supported
- Add the item type colors as theme tokens in `globals.css`:

```css
@theme {
  --color-type-note: #3b82f6;
  --color-type-flashcard: #8b5cf6;
  --color-type-formula: #f97316;
  --color-type-question: #fde047;
  --color-type-link: #10b981;
  --color-type-video: #ef4444;
  --color-type-file: #6b7280;
  --color-type-image: #ec4899;
}
```

### 3. Dashboard route & layout

- Route: `/dashboard` at `src/app/(app)/dashboard/page.tsx`
- Shared layout for authenticated pages: `src/app/(app)/layout.tsx` with three regions: top bar, sidebar, main area
- Full-height layout; only the main area scrolls

### 5. Top bar (display only)

- Search input with a search icon and a `⌘K` hint (not functional yet)
- "New Item" button with a `Plus` icon (not functional yet)
- Space on the left for the sidebar toggle (added in phase 2)

### 6. Placeholders

- Sidebar region: `<h2>Sidebar</h2>`
- Main region: `<h2>Main</h2>`

## Out of Scope

- Authentication (the route stays unprotected for now)
- Database queries
- Working search or item creation

## Acceptance Criteria

- [ ] `/dashboard` renders with the top bar and both placeholders
- [ ] Dark mode is the default
- [ ] No `tailwind.config.*` file exists
- [ ] `src/lib/mock-data.ts` is fully typed (no `any`)
- [ ] `npm run lint` and `npm run build` pass

## References

- @context/project-overview.md
- @context/coding-standards.md
- @context/screenshots/ *(optional)*
- @context/features/dashboard-phase-2-spec.md
- @context/features/dashboard-phase-3-spec.md
