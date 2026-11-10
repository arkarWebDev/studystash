import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaNeon } from "@prisma/adapter-neon";
import { ContentType, PrismaClient, Rating, type Prisma } from "../src/generated/prisma/client";
import {
  BCRYPT_ROUNDS,
  DEMO_COLLECTIONS,
  DEMO_ITEMS,
  DEMO_REVIEW_HISTORY,
  DEMO_TAGS,
  DEMO_USER,
  URL_TYPES,
  type CollectionKey,
  type DemoItem,
  type DemoReviewState,
} from "./seed-data/demo";

const SYSTEM_ITEM_TYPES = [
  { name: "note", slug: "notes", icon: "NotebookPen", color: "#3b82f6" },
  { name: "flashcard", slug: "flashcards", icon: "Layers", color: "#8b5cf6" },
  { name: "formula", slug: "formulas", icon: "Sigma", color: "#f97316" },
  { name: "question", slug: "questions", icon: "CircleHelp", color: "#fde047" },
  { name: "link", slug: "links", icon: "Link", color: "#10b981" },
  { name: "video", slug: "videos", icon: "Video", color: "#ef4444" },
  { name: "file", slug: "files", icon: "File", color: "#6b7280" },
  { name: "image", slug: "images", icon: "Image", color: "#ec4899" },
] as const;

const DAY_MS = 24 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const COLLECTION_CREATED_DAYS_AGO = 14;
const TRANSACTION_TIMEOUT_MS = 60_000;
const TRANSACTION_MAX_WAIT_MS = 10_000;

const SM2_QUALITY: Record<Rating, number> = { AGAIN: 1, HARD: 3, GOOD: 4, EASY: 5 };
const SM2_MIN_EASE = 1.3;
const SM2_INITIAL_STATE: Sm2State = { interval: 0, repetitions: 0, easeFactor: 2.5 };

interface Sm2State {
  interval: number;
  repetitions: number;
  easeFactor: number;
}

interface DemoSummary {
  email: string;
  collections: number;
  items: number;
  tags: number;
  dueToday: number;
}

type Tx = Prisma.TransactionClient;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

const shiftDays = (from: Date, days: number): Date => new Date(from.getTime() + days * DAY_MS);

function requireId(ids: Map<string, string>, key: string): string {
  const id = ids.get(key);
  if (!id) throw new Error(`Seed data references unknown key "${key}"`);
  return id;
}

// ─────────────────────────────────────────────
// System item types (always)
// ─────────────────────────────────────────────

// Postgres treats NULLs as distinct in unique constraints, so an upsert on
// [userId, slug] can't match system types. Find by slug where userId is null.
async function seedSystemItemTypes(): Promise<Map<string, string>> {
  const ids = new Map<string, string>();

  for (const type of SYSTEM_ITEM_TYPES) {
    const existing = await db.itemType.findFirst({
      where: { slug: type.slug, userId: null },
      select: { id: true },
    });

    const saved = existing
      ? await db.itemType.update({ where: { id: existing.id }, data: { ...type, isSystem: true } })
      : await db.itemType.create({ data: { ...type, isSystem: true, userId: null } });

    ids.set(type.name, saved.id);
  }

  return ids;
}

// ─────────────────────────────────────────────
// Demo data (SEED_DEMO=true only)
// ─────────────────────────────────────────────

async function createDemoUser(tx: Tx, passwordHash: string, now: Date): Promise<string> {
  // Cascade deletes all of the demo user's data, so the seed can be re-run.
  await tx.user.deleteMany({ where: { email: DEMO_USER.email } });

  const user = await tx.user.create({
    data: {
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      passwordHash,
      emailVerified: now,
      isPro: DEMO_USER.isPro,
      reviewStreak: DEMO_USER.reviewStreak,
      lastReviewedAt: shiftDays(now, -1),
      timezone: DEMO_USER.timezone,
    },
    select: { id: true },
  });

  return user.id;
}

async function createCollections(tx: Tx, userId: string, now: Date): Promise<Map<CollectionKey, string>> {
  const created = await tx.collection.createManyAndReturn({
    data: DEMO_COLLECTIONS.map((collection) => ({
      userId,
      name: collection.name,
      description: collection.description,
      examDate: collection.examInDays === null ? null : shiftDays(now, collection.examInDays),
      isFavorite: collection.isFavorite,
      createdAt: shiftDays(now, -COLLECTION_CREATED_DAYS_AGO),
      updatedAt: shiftDays(now, -collection.updatedDaysAgo),
    })),
    select: { id: true, name: true },
  });

  const idsByName = new Map(created.map((row) => [row.name, row.id]));
  return new Map(DEMO_COLLECTIONS.map((collection) => [collection.key, requireId(idsByName, collection.name)]));
}

function toItemInput(
  item: DemoItem,
  index: number,
  userId: string,
  typeIds: Map<string, string>,
  now: Date,
): Prisma.ItemCreateManyInput {
  // Offset by index (minutes) so items created on the same day still have a clear order.
  const offsetMs = index * MINUTE_MS;
  const createdAt = new Date(shiftDays(now, -item.createdDaysAgo).getTime() - offsetMs);
  const updatedAt = new Date(shiftDays(now, -(item.updatedDaysAgo ?? item.createdDaysAgo)).getTime() - offsetMs);

  return {
    userId,
    itemTypeId: requireId(typeIds, item.type),
    title: item.title,
    description: item.description ?? null,
    contentType: URL_TYPES.includes(item.type) ? ContentType.URL : ContentType.TEXT,
    content: item.content ?? null,
    answer: item.answer ?? null,
    url: item.url ?? null,
    isPinned: item.isPinned ?? false,
    isFavorite: item.isFavorite ?? false,
    lastUsedAt: updatedAt,
    createdAt,
    updatedAt,
  };
}

async function createItems(
  tx: Tx,
  userId: string,
  typeIds: Map<string, string>,
  now: Date,
): Promise<Map<string, string>> {
  const created = await tx.item.createManyAndReturn({
    data: DEMO_ITEMS.map((item, index) => toItemInput(item, index, userId, typeIds, now)),
    select: { id: true, title: true },
  });

  return new Map(created.map((row) => [row.title, row.id]));
}

async function linkItemsToCollections(
  tx: Tx,
  itemIds: Map<string, string>,
  collectionIds: Map<CollectionKey, string>,
): Promise<void> {
  const links = DEMO_ITEMS.flatMap((item) =>
    [item.collection, ...(item.alsoIn ?? [])].map((key) => ({
      itemId: requireId(itemIds, item.title),
      collectionId: requireId(collectionIds, key),
    })),
  );

  await tx.itemCollection.createMany({ data: links });
}

function toReviewInput(
  review: DemoReviewState,
  itemId: string,
  userId: string,
  now: Date,
): Prisma.FlashcardReviewCreateManyInput {
  if (review.group === "new") {
    return { itemId, userId, dueDate: now, ...SM2_INITIAL_STATE, lastReviewedAt: null };
  }

  // "due" cards are due earlier than now, even when overdueDays is 0 (earlier today).
  const dueDate =
    review.group === "due"
      ? new Date(shiftDays(now, -review.overdueDays).getTime() - HOUR_MS)
      : shiftDays(now, review.dueInDays);

  return {
    itemId,
    userId,
    dueDate,
    interval: review.interval,
    repetitions: review.repetitions,
    easeFactor: review.easeFactor,
    lastReviewedAt: shiftDays(dueDate, -review.interval),
  };
}

async function createFlashcardReviews(
  tx: Tx,
  userId: string,
  itemIds: Map<string, string>,
  now: Date,
): Promise<void> {
  const reviews = DEMO_ITEMS.filter((item) => item.type === "flashcard").map((item) => {
    if (!item.review) throw new Error(`Flashcard "${item.title}" has no review state`);
    return toReviewInput(item.review, requireId(itemIds, item.title), userId, now);
  });

  await tx.flashcardReview.createMany({ data: reviews });
}

function applySm2(state: Sm2State, rating: Rating): Sm2State {
  const q = SM2_QUALITY[rating];
  const easeFactor = Math.max(SM2_MIN_EASE, state.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  const rounded = Math.round(easeFactor * 100) / 100;

  if (q < 3) return { interval: 1, repetitions: 0, easeFactor: rounded };

  const interval =
    state.repetitions === 0 ? 1 : state.repetitions === 1 ? 6 : Math.round(state.interval * state.easeFactor);
  return { interval, repetitions: state.repetitions + 1, easeFactor: rounded };
}

// Replays the review history per card with SM-2, so each log's interval and
// ease factor are realistic for its rating.
async function createReviewLogs(
  tx: Tx,
  userId: string,
  itemIds: Map<string, string>,
  now: Date,
): Promise<void> {
  const states = new Map<string, Sm2State>();
  const logs: Prisma.ReviewLogCreateManyInput[] = [];

  for (const day of DEMO_REVIEW_HISTORY) {
    day.reviews.forEach(([title, rating], index) => {
      const next = applySm2(states.get(title) ?? SM2_INITIAL_STATE, rating);
      states.set(title, next);
      logs.push({
        userId,
        itemId: requireId(itemIds, title),
        rating,
        interval: next.interval,
        easeFactor: next.easeFactor,
        reviewedAt: new Date(shiftDays(now, -day.daysAgo).getTime() + index * 2 * MINUTE_MS),
      });
    });
  }

  await tx.reviewLog.createMany({ data: logs });
}

async function createTags(tx: Tx, userId: string, itemIds: Map<string, string>): Promise<void> {
  for (const name of DEMO_TAGS) {
    const taggedIds = DEMO_ITEMS.filter((item) => item.tags.includes(name)).map((item) =>
      requireId(itemIds, item.title),
    );

    await tx.tag.create({
      data: { name, userId, items: { connect: taggedIds.map((id) => ({ id })) } },
    });
  }
}

async function seedDemoData(typeIds: Map<string, string>, now: Date): Promise<DemoSummary> {
  // Hash outside the transaction: it is slow on purpose and doesn't touch the database.
  const passwordHash = await hash(DEMO_USER.password, BCRYPT_ROUNDS);

  const userId = await db.$transaction(
    async (tx) => {
      const id = await createDemoUser(tx, passwordHash, now);
      const collectionIds = await createCollections(tx, id, now);
      const itemIds = await createItems(tx, id, typeIds, now);

      await linkItemsToCollections(tx, itemIds, collectionIds);
      await createFlashcardReviews(tx, id, itemIds, now);
      await createReviewLogs(tx, id, itemIds, now);
      await createTags(tx, id, itemIds);
      return id;
    },
    { timeout: TRANSACTION_TIMEOUT_MS, maxWait: TRANSACTION_MAX_WAIT_MS },
  );

  const [collections, items, tags, dueToday] = await Promise.all([
    db.collection.count({ where: { userId } }),
    db.item.count({ where: { userId } }),
    db.tag.count({ where: { userId } }),
    db.flashcardReview.count({ where: { userId, dueDate: { lte: now } } }),
  ]);

  return { email: DEMO_USER.email, collections, items, tags, dueToday };
}

// ─────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────

async function main(): Promise<void> {
  const isDemo = process.env.SEED_DEMO === "true";

  if (isDemo && process.env.NODE_ENV === "production") {
    throw new Error("Refusing to seed demo data with NODE_ENV=production. Set SEED_DEMO=false.");
  }

  const typeIds = await seedSystemItemTypes();
  console.log(`✔ System item types: ${typeIds.size}`);

  if (!isDemo) {
    console.log("ℹ Demo data skipped (set SEED_DEMO=true to add it)");
    return;
  }

  const summary = await seedDemoData(typeIds, new Date());
  console.log(`✔ Demo user: ${summary.email}`);
  console.log(`✔ Collections: ${summary.collections} | Items: ${summary.items} | Tags: ${summary.tags}`);
  console.log(`✔ Flashcards due today: ${summary.dueToday}`);
}

main()
  .catch((error: unknown) => {
    console.error("✖ Seeding failed:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
