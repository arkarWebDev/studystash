import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

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

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

// Postgres treats NULLs as distinct in unique constraints, so an upsert on
// [userId, slug] can't match system types. Find by slug where userId is null.
async function seedSystemItemTypes(): Promise<void> {
  for (const type of SYSTEM_ITEM_TYPES) {
    const existing = await db.itemType.findFirst({
      where: { slug: type.slug, userId: null },
      select: { id: true },
    });

    if (existing) {
      await db.itemType.update({
        where: { id: existing.id },
        data: { ...type, isSystem: true },
      });
    } else {
      await db.itemType.create({
        data: { ...type, isSystem: true, userId: null },
      });
    }
  }
}

seedSystemItemTypes()
  .catch((error: unknown) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
