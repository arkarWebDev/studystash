# StudyStash — AI Interaction Guidelines

## Context Files

Read these before starting any task:

- @context/project-overview.md — features, data model, Prisma schema, tech stack
- @context/coding-standards.md — code rules and patterns
- @context/current-feature.md — the feature or fix currently being worked on

If a request conflicts with these files, point out the conflict and ask before continuing.

## Communication

- Be concise and direct
- Explain non-obvious decisions briefly
- Ask before large refactors or architectural changes
- Don't add features that aren't in the project spec
- Never delete files without asking first
- If a library or API version is uncertain (Next.js 16, Prisma 7, Auth.js v5, Tailwind v4), check the current docs instead of guessing from older versions

## Workflow

We use this workflow for every feature and fix:

1. **Document** — Write up the feature in @context/current-feature.md
2. **Branch** — Create a new branch for the feature or fix
3. **Implement** — Build what is described in @context/current-feature.md
4. **Test** — Check it in the browser (dark and light mode, desktop and mobile). Run `npm run lint` and `npm run build` and fix every error. Unit tests will be added later; until then, test new `src/lib/` logic (SM-2, limits, streaks) when it is added
5. **Iterate** — Make changes as needed
6. **Commit** — Only after the build passes and everything works, and only with my permission
7. **Merge** — Merge into `main`
8. **Delete branch** — Ask before deleting the branch after the merge
9. **Review** — Review AI-generated code regularly, and whenever I ask
10. **Complete** — Mark the feature as done in @context/current-feature.md and move it to History

Do NOT commit without permission or before the build passes. If the build fails, fix it first.

## Branching

- Create a new branch for every feature and fix
- Naming: `feature/[name]`, `fix/[name]`, `chore/[name]` — kebab-case (e.g. `feature/flashcard-review`, `fix/streak-timezone`)
- Ask before deleting a branch once it has been merged

## Commits

- Ask before committing (don't auto-commit)
- Use conventional commit messages: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `style:`, `test:`
- Keep each commit focused on one feature or fix
- Commit Prisma migrations in the same commit as the schema change that created them
- Never put "Generated with Claude" or any AI attribution in commit messages

## Database & Environment

- **Never** run `prisma db push` or change the database directly
- Ask before creating a migration, and give it a descriptive name (`prisma migrate dev --name add_flashcard_review`)
- Warn me before any migration that could lose data (dropping columns or tables, changing types)
- Never run `prisma migrate reset` without asking
- Never read, print or change `.env` files; if a new variable is needed, tell me and add it to `.env.example`
- Ask before installing a new dependency, and explain why it is needed

## When Stuck

- If something still isn't working after 2–3 attempts, stop and explain the problem
- Don't keep trying random fixes
- Ask for clarification when the requirements are unclear

## Code Changes

- Make the smallest change that accomplishes the task
- Don't refactor unrelated code unless asked
- Don't add "nice to have" features
- Follow the existing patterns in the codebase
- Don't edit generated code (`src/generated/prisma/`) and avoid editing `src/components/ui/` (shadcn) unless needed

## Code Review

Review AI-generated code regularly, focusing on:

- **Security** — auth check in every action and API route; every query scoped by `userId`; Zod validation on all input; system item types can't be edited; no unsanitized HTML
- **Plan limits** — free vs. Pro checks go through `lib/limits.ts` and run on the server
- **Performance** — unnecessary re-renders, unnecessary `'use client'`, N+1 queries, over-fetching (use `select`)
- **Logic errors** — edge cases such as empty collections, no cards due, timezone boundaries for streaks and due dates, files deleted from R2 when their item is deleted
- **AI output** — structured responses validated with Zod before use; user confirms before saving
- **Patterns** — matches @context/coding-standards.md and the existing codebase

## current-feature.md Template

```markdown
# Current Feature

## Status
In progress | Complete

## Goal
One or two sentences describing what this feature or fix does.

## Requirements
- [ ] Requirement 1
- [ ] Requirement 2

## Notes
Decisions, edge cases, open questions.

## History
- YYYY-MM-DD — feature/name — short summary
```
