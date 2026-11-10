# Database Setup Spec — Prisma 7 + Neon PostgreSQL

## Overview

Set up Prisma ORM 7 with a Neon serverless PostgreSQL database for StudyStash: create the initial schema, run the first migration and seed the system item types. The dashboard keeps using `src/lib/mock-data.ts` for now; replacing it with real queries is a separate feature.

## ⚠️ Version Warning — Read First

- **Use Prisma ORM 7, not Prisma 8.** Since August 2026, `npm install prisma` and `npx prisma` (`prisma@latest`) install **Prisma 8**, a full rewrite that has no `generate`, `migrate dev` or `db push` and does not read `schema.prisma`. Prisma 7 is now tagged `prisma@prev`.
- Always install with an explicit `@7` and lock the major version in `package.json`.
- Ignore Prisma's update notifier if it suggests `npm i prisma@latest`.
- All Prisma packages (`prisma`, `@prisma/client`, `@prisma/adapter-neon`) must be on the **same 7.x version**.
- Don't rely on older Prisma knowledge. Read the docs first:
  - Prisma 7 upgrade guide: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
  - Prisma 7 AI migration prompt: https://www.prisma.io/docs/ai/prompts/prisma-7
  - Neon + Prisma guide: https://neon.com/docs/guides/prisma
  - Neon + Prisma Migrate: https://neon.com/docs/guides/prisma-migrate
  - Prisma release status (7 vs 8): https://www.prisma.io/docs/orm/release-status

If anything in this spec conflicts with the latest Prisma 7 or Neon docs, follow the docs and tell me what changed.

## Prisma 7 Changes to Follow

| Area | Prisma 7 rule |
| --- | --- |
| Requirements | Node.js 20.19+, 22.12+ or 24+; TypeScript 5.4+ |
| Generator | `provider = "prisma-client"` (not `prisma-client-js`), `output` is required |
| Imports | Import from the generated path (`@/generated/prisma/client`), **not** `@prisma/client` |
| Datasource | No `url` / `directUrl` in `schema.prisma`; the CLI connection goes in the Prisma config file |
| Config file | `prisma7.config.ts` at the project root (Prisma 7.10+). Older 7.x uses `prisma.config.ts`. Keep **only one** config file |
| Env vars | `.env` is not loaded automatically: add `import "dotenv/config"` to the config file |
| Client | Must be created with a driver adapter: `PrismaNeon` from `@prisma/adapter-neon` |
| Generate | `migrate dev` no longer runs `prisma generate`; run it yourself |
| Seed | `migrate dev` / `migrate reset` no longer seed automatically; run `prisma db seed`. The seed command lives in the config file, not `package.json` |
| Removed | `--skip-generate` and `--skip-seed` flags, `prisma.$use()` middleware |
| Pooling | `connection_limit` / `pool_timeout` URL params do nothing; pass pool options to `PrismaNeon` |

## Requirements

### 1. Install (pinned to Prisma 7)

```bash
npm install @prisma/client@7 @prisma/adapter-neon@7 dotenv
npm install -D prisma@7 tsx
```

- **Do not** install `@neondatabase/serverless` or `ws` separately — `@prisma/adapter-neon` includes them
- Lock the major version in `package.json` (`"prisma": "^7"`, `"@prisma/client": "^7"`, `"@prisma/adapter-neon": "^7"`)
- Run `npx prisma --version` and confirm it shows 7.x
- Ask before installing anything not on this list

### 2. Environment

Neon gives two connection strings per branch:

```bash
# Pooled (hostname contains -pooler) — used by the app at runtime
DATABASE_URL="postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require"

# Direct (no -pooler) — used by the Prisma CLI for migrations
DATABASE_URL_UNPOOLED="postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

- Both point to the Neon **development** branch locally
- Add both with placeholder values to `.env.example`
- Don't read, print or change `.env`; tell me if a new variable is needed

### 3. Configuration

`prisma7.config.ts` at the project root:

```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL_UNPOOLED"),
  },
});
```

`prisma/schema.prisma` header:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

- Add `src/generated/prisma` to `.gitignore`
- Don't change `"type"` in `package.json` unless the build requires it; Next.js handles the ESM client

### 4. Schema

Create the initial schema from the **Prisma Schema** section of @context/project-overview.md (this will evolve):

- Enums: `ContentType` (`TEXT`, `URL`, `FILE`), `Rating` (`AGAIN`, `HARD`, `GOOD`, `EASY`)
- Auth.js models: `User`, `Account`, `Session`, `VerificationToken`
- Core models: `ItemType`, `Item`, `Collection`, `ItemCollection`, `Tag`
- Spaced repetition models: `FlashcardReview`, `ReviewLog`
- Keep the indexes from the project overview (e.g. `[userId, dueDate]` on `FlashcardReview`, `[userId, itemTypeId]` on `Item`)
- Cascade deletes:
  - Deleting a `User` deletes all of their data
  - Deleting an `Item` deletes its `FlashcardReview`, `ReviewLog`s and `ItemCollection` links
  - Deleting a `Collection` deletes its `ItemCollection` links but **not** the items
  - Deleting an `ItemType` that is still used by items is blocked (`Restrict`)
  - `Collection.defaultTypeId` is set to null if its type is deleted

### 5. Prisma client

`src/lib/db.ts` exports a single client using the Neon adapter and the **pooled** URL:

```ts
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

const createPrismaClient = () => {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

- Reuses the instance in development so hot reload doesn't open new connections
- All other code imports the client from `@/lib/db` only
- Check the generated import path after `prisma generate` and adjust if it differs

### 6. First migration

```bash
npx prisma migrate dev --name init
npx prisma generate
```

- Commit the generated SQL in `prisma/migrations/`

### 7. Seed

- `prisma/seed.ts` seeds the 8 system item types from the seed table in @context/project-overview.md (name, slug, icon, color, `isSystem: true`, `userId: null`)
- The seed creates its own client with `PrismaNeon` and imports from the generated path (relative import, since `tsx` doesn't resolve the `@/` alias by default)
- Must be safe to run more than once: find by slug where `userId` is null, then create or update. Postgres allows duplicate `NULL`s in unique constraints, so a plain upsert on `[userId, slug]` won't work
- Seed system types only; no fake users or items
- Run it explicitly with `npx prisma db seed` (it no longer runs after `migrate dev`)

### 8. Scripts (`package.json`)

```json
{
  "db:generate": "prisma generate",
  "db:migrate": "prisma migrate dev && prisma generate",
  "db:deploy": "prisma migrate deploy",
  "db:status": "prisma migrate status",
  "db:seed": "prisma db seed",
  "db:studio": "prisma studio",
  "postinstall": "prisma generate"
}
```

## Branches & Migrations

- Neon has two branches: **development** (in local `.env`) and **production**
- **ALWAYS** create migrations: `prisma migrate dev` in development, `prisma migrate deploy` in production
- **NEVER** use `prisma db push` or change the database directly unless I say so
- Never run `prisma migrate reset` without asking
- Run `prisma migrate status` before committing
- In CI or one-off commands without a local install, use `npx prisma@7`, never plain `npx prisma`

## Out of Scope

- Auth.js setup (sign-in pages, providers)
- Replacing mock data with real queries
- Production deployment
- Upgrading to Prisma 8

## Acceptance Criteria

- [ ] `npx prisma --version` shows 7.x, and all Prisma packages share the same 7.x version
- [ ] Only one Prisma config file exists (`prisma7.config.ts`)
- [ ] `prisma/schema.prisma` has no `url` and matches the models in @context/project-overview.md
- [ ] `init` migration created and applied to the Neon dev branch using the unpooled URL
- [ ] App client uses `PrismaNeon` with the pooled URL and imports from the generated path
- [ ] `npm run db:seed` creates the 8 system item types and can be run twice without errors or duplicates
- [ ] `npm run db:status` shows migrations in sync
- [ ] System types are visible in Prisma Studio
- [ ] `npm run lint` and `npm run build` pass

## References

- @context/project-overview.md — data models and Prisma schema
- @context/coding-standards.md — database standards
- @context/ai-interaction.md — workflow and migration rules