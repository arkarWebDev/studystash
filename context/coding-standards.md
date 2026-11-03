# StudyStash — Coding Standards

These rules apply to all code in the StudyStash repo. When in doubt, follow the existing patterns in `src/lib` and `src/actions`.

---

## TypeScript

- Strict mode enabled (`"strict": true`, plus `"noUncheckedIndexedAccess": true`)
- No `any` — use proper types or `unknown` and narrow it
- Define interfaces for all component props, action results, API responses and AI outputs
- Use type inference where obvious, explicit types where helpful (function return types in `lib/` and `actions/`)
- Reuse Prisma-generated types instead of redefining models:

```ts
import type { Item, ItemType } from "@/generated/prisma/client";
import type { Prisma } from "@/generated/prisma/client";

type ItemWithType = Prisma.ItemGetPayload<{ include: { itemType: true } }>;
```

- Derive types from Zod schemas where a schema exists: `type ItemInput = z.infer<typeof itemSchema>`
- Use the Prisma enums (`ContentType`, `Rating`) instead of string literals

---

## React

- Functional components only (no class components)
- Use hooks for state and side effects
- Keep components focused — one job per component
- Extract reusable logic into custom hooks in `src/hooks/` (e.g. `useReviewShortcuts`, `useItemDrawer`)
- Avoid `useEffect` for data fetching; fetch in server components instead
- Lists must have stable keys (database IDs, never array indexes)

---

## Next.js 16

- Server components by default
- Only use `'use client'` when needed (interactivity, hooks, browser APIs); push it as far down the tree as possible
- `params` and `searchParams` are async — always `await` them:

```tsx
interface ItemsPageProps {
  params: Promise<{ type: string }>;
}

export default async function ItemsPage({ params }: ItemsPageProps) {
  const { type } = await params;
  // ...
}
```

- Use Server Actions for form submissions and simple mutations (create / edit / delete items, collections, review ratings)
- Use API routes (`src/app/api/`) only when you need:
  - Webhooks (Stripe)
  - File uploads (R2 presigned URLs)
  - AI calls (long-running, rate-limited, possibly streamed)
  - Export downloads (specific headers like `Content-Disposition`)
  - Specific HTTP status codes or headers
  - Endpoints for future mobile / CLI clients
- Otherwise, fetch data directly in server components
- Dynamic routes for item and collection pages (`/items/[type]`, `/collections/[id]`, `/review/[collectionId]`)
- Call `revalidatePath` after mutations that change what a page shows (dashboard counts, sidebar badges)
- Every route group gets `loading.tsx` (skeletons) and `error.tsx`

---

## Tailwind CSS v4

**CRITICAL: We are using Tailwind CSS v4, which uses CSS-based configuration.**

- DO NOT create `tailwind.config.ts` or `tailwind.config.js` files (those are for v3)
- All theme configuration lives in CSS using the `@theme` directive in `src/app/globals.css`
- Use CSS custom properties for colors, spacing, etc.
- No JavaScript-based config allowed

Item type colors are theme tokens, so they are never hard-coded in components:

```css
@import "tailwindcss";

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

```tsx
<div className="border-type-flashcard" />
```

---

## File Organization

| What | Where |
| --- | --- |
| Components | `src/components/[feature]/ComponentName.tsx` |
| shadcn/ui components | `src/components/ui/` (generated, edit sparingly) |
| Pages | `src/app/[route]/page.tsx` |
| API routes | `src/app/api/[feature]/route.ts` |
| Server Actions | `src/actions/[feature].ts` |
| Types | `src/types/[feature].ts` |
| Zod schemas | `src/lib/validations/[feature].ts` |
| Hooks | `src/hooks/useHookName.ts` |
| Lib / utils | `src/lib/[utility].ts` |
| Prisma client output | `src/generated/prisma/` (never edit) |

Features: `items`, `collections`, `review`, `search`, `ai`, `billing`, `auth`, `settings`.

Key shared modules:

- `src/lib/db.ts` — single Prisma client instance (Neon adapter)
- `src/lib/auth.ts` — Auth.js config and `auth()` helper
- `src/lib/limits.ts` — all free vs. Pro checks
- `src/lib/sm2.ts` — spaced repetition scheduling (pure functions)
- `src/lib/r2.ts`, `src/lib/openai.ts`, `src/lib/stripe.ts` — service clients

---

## Naming

- Components: PascalCase (`ItemCard.tsx`, `ReviewCard.tsx`)
- Files: match the component name, or kebab-case for non-components
- Functions: camelCase (`getDueCards`, `createItem`)
- Server Actions: verb + noun (`createItem`, `toggleFavorite`, `submitReview`)
- Hooks: `use` prefix (`useReviewShortcuts`)
- Constants: SCREAMING_SNAKE_CASE (`FREE_ITEM_LIMIT`, `FREE_COLLECTION_LIMIT`)
- Types / Interfaces: PascalCase, no prefix (`ItemCardProps`, not `IItemCardProps`)
- Booleans: `is` / `has` / `can` prefix (`isPro`, `hasAnswer`, `canUpload`)

---

## Styling

- Tailwind CSS for all styling
- Use shadcn/ui components where applicable (Drawer, Dialog, Command, Sonner, Skeleton, etc.)
- Use the `cn()` helper for conditional classes
- No inline styles
- Dark mode first, light mode as an option — check every component in both
- Icons from `lucide-react` only
- Mobile-usable everywhere; review mode must work fully with touch

---

## Database

- Use Prisma ORM for all database operations; import the client only from `src/lib/db.ts`
- **Never** use `prisma db push` or change the database directly
- Always use `prisma migrate dev --name <descriptive_name>` for schema changes
- Run `prisma migrate status` before committing to verify migrations are in sync
- Production deployments must run `prisma migrate deploy` before the app starts
- Commit the migration SQL together with the schema change
- Seed system item types with an idempotent `prisma/seed.ts` (upserts only)
- Use `select` / `include` to fetch only what a page needs
- Use `prisma.$transaction` for multi-step writes (e.g. saving a review: update `FlashcardReview` + insert `ReviewLog` + update streak)

---

## Auth & Data Access

- Every Server Action and API route starts by getting the session; return early if there is no user:

```ts
const session = await auth();
if (!session?.user?.id) {
  return { success: false, error: "Not authenticated" };
}
```

- **Every query is scoped by `userId`.** Never trust an ID from the client on its own:

```ts
// ✅
await db.item.update({ where: { id, userId }, data });

// ❌
await db.item.update({ where: { id }, data });
```

- System item types (`userId = null`) are read-only; reject any update or delete on them
- Protect app routes in `src/proxy.ts` (Next.js 16 replacement for `middleware.ts`), but still check auth inside actions — the proxy is not a security boundary on its own

---

## Plan Limits (Free vs. Pro)

- All plan checks go through `src/lib/limits.ts` — never check `isPro` inline in components or actions
- Enforce limits **server-side**; the UI only shows upgrade prompts
- During development, `PRO_FOR_ALL=true` gives every user Pro access

```ts
const canCreate = await canCreateItem(userId);
if (!canCreate) {
  return { success: false, error: "Free plan limit reached (100 items). Upgrade to Pro for unlimited items." };
}
```

---

## Data Fetching

- Server components fetch directly with Prisma (through query functions in `src/lib/queries/` when reused)
- Client components mutate through Server Actions
- Validate all inputs with Zod — in actions, API routes, CSV / file imports and AI responses
- Never send secrets or other users' data to client components; pass plain serializable props

---

## Error Handling

- Use try/catch in Server Actions and API routes
- Return the `{ success, data, error }` pattern from actions:

```ts
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

- Display user-friendly error messages via toast (Sonner); log the real error on the server
- Never expose raw Prisma, Stripe or OpenAI errors to the user
- API routes return proper status codes (`400` validation, `401` unauthenticated, `403` Pro required, `404`, `429` rate limited)

---

## File Uploads (Cloudflare R2)

- Uploads go browser → R2 via presigned URLs from `src/app/api/uploads/`
- Validate MIME type and file size on the server before issuing a URL
- Store objects under a per-user prefix: `users/{userId}/{itemId}/{fileName}`
- Delete the R2 object when its item is deleted
- File and image uploads are Pro-only (checked via `lib/limits.ts`)

---

## AI Features

- All OpenAI calls go through `src/lib/openai.ts`, called only from API routes
- Use structured outputs with a Zod schema for flashcards, quizzes and tags; validate the response before using it
- Extract PDF text server-side and truncate to a safe size before sending
- Rate-limit AI routes per user
- Generated content is always previewed and confirmed by the user before it is saved
- Keep prompts in `src/lib/ai/prompts.ts`, not inline in route handlers

---

## Spaced Repetition

- SM-2 logic lives in `src/lib/sm2.ts` as pure functions with no database or date side effects (pass `now` in)
- Dates for "due today" and streaks are calculated in the user's timezone
- Keyboard shortcuts in review mode: `Space` = flip, `1`–`4` = Again / Hard / Good / Easy; ignore them while typing in an input

---

## Markdown, Math & Code

- Render markdown with `react-markdown` + `remark-math` + `rehype-katex`
- Highlight code blocks with Shiki
- Never render user content with `dangerouslySetInnerHTML` unless it has been sanitized

---

## Accessibility

- All interactive elements are keyboard reachable with visible focus states
- Icon-only buttons have an `aria-label`
- Respect `prefers-reduced-motion` for the card flip and celebration animations
- Type colors are never the only signal — always pair with the type icon or label

---

## Testing

- Unit-test pure logic in `src/lib/` with Vitest (SM-2, streaks, limits, CSV parsing)
- Every bug fix in `lib/` gets a test that reproduces it

---

## Code Quality

- No commented-out code unless specified
- No unused imports or variables
- Keep functions under 50 lines when possible
- No `console.log` in committed code (use `console.error` for server-side errors only)
- No magic numbers — name them as constants (`FREE_ITEM_LIMIT = 100`)
- Run lint, type-check and `prisma migrate status` before every commit
