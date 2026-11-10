# Seed Data Spec

## Overview

Create a seed script (`prisma/seed.ts`) that fills the database with system item types and realistic demo data for development and demos. The demo data mirrors `src/lib/mock-data.ts`, so the dashboard looks the same when it switches from mock data to real queries.

## Setup Rules (Prisma 7)

- The seed command is configured in `prisma7.config.ts` (`seed: "tsx prisma/seed.ts"`), not in `package.json`
- Run it explicitly with `npm run db:seed`; it does not run automatically after `migrate dev`
- Create the client with `PrismaNeon` and import from the generated path using a **relative import** (`tsx` does not resolve the `@/` alias)
- Load env vars with `import "dotenv/config"`
- Install `bcryptjs` for password hashing (ask first)

## Two Parts

| Part | Runs | What |
| --- | --- | --- |
| **System types** | Always (dev and production) | The 8 system item types |
| **Demo data** | Only when `SEED_DEMO=true` | Demo user, collections, items, tags, review state |

- If `SEED_DEMO=true` and `NODE_ENV=production`, stop with an error. Demo data must never reach the production branch.
- Add `SEED_DEMO=false` to `.env.example`

## Idempotency

The script must be safe to run any number of times:

- **System types:** find by `slug` where `userId` is null, then update or create (no duplicates)
- **Demo data:** delete the demo user if it exists (cascade deletes all of its data), then recreate everything

## 1. System Item Types

All with `isSystem: true` and `userId: null`. Icons are Lucide React component names.

| Name | Slug | Icon | Color |
| --- | --- | --- | --- |
| note | notes | NotebookPen | #3b82f6 |
| flashcard | flashcards | Layers | #8b5cf6 |
| formula | formulas | Sigma | #f97316 |
| question | questions | CircleHelp | #fde047 |
| link | links | Link | #10b981 |
| video | videos | Video | #ef4444 |
| file | files | File | #6b7280 |
| image | images | Image | #ec4899 |

## 2. Demo User

| Field | Value |
| --- | --- |
| email | demo@studystash.io |
| name | Demo Student |
| passwordHash | `12345678` hashed with bcryptjs, 12 rounds |
| emailVerified | now |
| isPro | true (the demo shows 5 collections, more than the free limit of 3) |
| reviewStreak | 4 |
| lastReviewedAt | yesterday |
| timezone | Asia/Yangon |

## 3. Collections & Items

Use realistic study content. Calculate all dates relative to now so countdowns and "due today" stay correct whenever the seed runs.

### Calculus II

_Description: Integration techniques, series and exam practice_ — **exam in 12 days**, favorite

- 2 notes (markdown): integration by parts, convergence tests
- 3 formulas (LaTeX): integration by parts, power rule, ratio test
- 2 questions with worked answers (one past-exam question has `answer: null`)
- 1 video (real URL, e.g. 3Blue1Brown's Essence of Calculus)

### Organic Chemistry

_Description: Reaction mechanisms and key definitions_

- 2 notes: SN1 vs SN2, functional groups
- 4 flashcards: definitions (nucleophile, electrophile, chirality, isomer)
- 1 link (real URL, e.g. a Khan Academy organic chemistry page)

### IELTS Vocabulary

_Description: Academic word list and writing phrases_ — **exam in 30 days**, favorite

- 8 flashcards: front = word, back = meaning + example sentence
- 1 note: Task 2 essay structure
- 1 link (real URL: the official IELTS site)

### Learn TypeScript

_Description: Notes and practice while learning TypeScript_

- 2 notes with code blocks: generics, utility types
- 3 flashcards: TypeScript concepts
- 2 links (real URLs: TypeScript handbook, MDN)
- 1 video (real URL)

### Final Exam Prep

_Description: Everything to revise before finals_ — **exam in 3 days**

- No items of its own. It reuses existing items (via `ItemCollection`): 2 Calculus formulas, 1 Calculus question, 2 Organic Chemistry flashcards and the SN1 vs SN2 note
- This tests items belonging to more than one collection

### No file or image items

Don't seed `file` or `image` items; there are no real files in R2 yet.

## 4. Item Flags & Dates

- `isPinned`: 3 items (e.g. integration by parts formula, Task 2 essay note, SN1 vs SN2 note)
- `isFavorite`: 5 items across collections
- `createdAt` / `updatedAt`: spread over the last 14 days so "recent items" has a clear order
- Collections' `updatedAt`: different for each so "recent collections" has a clear order
- `contentType`: `TEXT` for notes, flashcards, formulas and questions; `URL` for links and videos

## 5. Tags

~8 tags for the demo user (e.g. `calculus`, `integration`, `chemistry`, `definitions`, `ielts`, `vocabulary`, `typescript`, `exam`), attached to related items.

## 6. Flashcard Review State

Every flashcard gets exactly one `FlashcardReview` row:

| Group | Count | State |
| --- | --- | --- |
| Due today | 6 | `dueDate` = today or earlier, `repetitions` ≥ 1 |
| New | 4 | `dueDate` = now, `repetitions` = 0, `interval` = 0, `easeFactor` = 2.5 |
| Not due yet | the rest | `dueDate` 2–10 days from now, varied `interval` and `easeFactor` |

This gives **10 cards due today** on the dashboard.

## 7. Review History

- `ReviewLog` rows for the last 4 days (including yesterday), 3–8 reviews per day, mixed ratings
- Each log's `interval` and `easeFactor` should be realistic for its rating
- This backs up the 4-day streak on the user

## 8. Output

When it finishes, print a short summary:

```
✔ System item types: 8
✔ Demo user: demo@studystash.io
✔ Collections: 5 | Items: 30 | Tags: 8
✔ Flashcards due today: 10
```

## Rules

- Use real URLs for links and videos. If you're not sure a specific video URL exists, use the channel or playlist page instead of inventing one
- Wrap the demo data in a transaction where possible
- Exit with a non-zero code and a clear message on any error, and always disconnect the client
- Follow @context/coding-standards.md (typed data, no `any`, SCREAMING_SNAKE_CASE constants)

## Acceptance Criteria

- [ ] `npm run db:seed` with `SEED_DEMO=false` creates only the 8 system types
- [ ] `npm run db:seed` with `SEED_DEMO=true` creates the full demo data
- [ ] Running it twice causes no errors and no duplicates
- [ ] The seed refuses to create demo data when `NODE_ENV=production`
- [ ] Every flashcard has a `FlashcardReview` row; 10 cards are due today
- [ ] Final Exam Prep shares items with other collections
- [ ] Can sign in later as demo@studystash.io / 12345678
- [ ] Data is visible and correct in Prisma Studio
- [ ] `npm run lint` and `npm run build` pass

## References

- @context/project-overview.md — data models and system types
- @context/features/database-spec.md — Prisma 7 + Neon setup
- @context/coding-standards.md
- @src/lib/mock-data.ts — keep the demo data consistent with it