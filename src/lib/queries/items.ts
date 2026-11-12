import { db } from "@/lib/db";
import { getItemPreview } from "@/lib/item-preview";
import type { Prisma } from "@/generated/prisma/client";
import type { ItemCardData, ItemStats } from "@/types/item";

const DEFAULT_RECENT_ITEMS_LIMIT = 10;

// Everything the card needs in one query; `answer` is never fetched
const itemCardSelect = {
  id: true,
  title: true,
  contentType: true,
  content: true,
  url: true,
  fileName: true,
  isPinned: true,
  isFavorite: true,
  updatedAt: true,
  itemType: { select: { slug: true, name: true, icon: true, color: true } },
  tags: { select: { name: true }, orderBy: { name: "asc" } },
} satisfies Prisma.ItemSelect;

type ItemCardRow = Prisma.ItemGetPayload<{ select: typeof itemCardSelect }>;

function toItemCardData({ content, url, fileName, itemType, tags, ...item }: ItemCardRow): ItemCardData {
  return {
    ...item,
    type: itemType,
    preview: getItemPreview({ typeName: itemType.name, contentType: item.contentType, content, url, fileName }),
    tags: tags.map((tag) => tag.name),
  };
}

export async function getPinnedItems(userId: string): Promise<ItemCardData[]> {
  const items = await db.item.findMany({
    where: { userId, isPinned: true },
    orderBy: { updatedAt: "desc" },
    select: itemCardSelect,
  });
  return items.map(toItemCardData);
}

export async function getRecentItems(userId: string, limit = DEFAULT_RECENT_ITEMS_LIMIT): Promise<ItemCardData[]> {
  const items = await db.item.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: itemCardSelect,
  });
  return items.map(toItemCardData);
}

export async function getItemStats(userId: string): Promise<ItemStats> {
  const [totalItems, favoriteItems] = await Promise.all([
    db.item.count({ where: { userId } }),
    db.item.count({ where: { userId, isFavorite: true } }),
  ]);
  return { totalItems, favoriteItems };
}
