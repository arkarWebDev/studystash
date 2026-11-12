// Dashboard item data over mock data. Collections come from the database (src/lib/queries/collections.ts).

import { mockItems, mockItemTypes, mockUser, type MockItem, type MockItemType } from "@/lib/mock-data";
import type { CollectionStats } from "@/types/collection";

const RECENT_ITEMS_LIMIT = 10;

export interface ReviewSummary {
  cardsDue: number;
  reviewStreak: number;
}

export interface ItemStats {
  totalItems: number;
  favoriteItems: number;
}

export type DashboardStats = ItemStats & CollectionStats;

export interface ItemWithType {
  item: MockItem;
  type: MockItemType;
}

const itemTypesById = new Map(mockItemTypes.map((type) => [type.id, type]));

function byUpdatedAtDesc<T extends { updatedAt: string }>(a: T, b: T): number {
  return b.updatedAt.localeCompare(a.updatedAt);
}

export function getReviewSummary(): ReviewSummary {
  return { cardsDue: mockUser.cardsDueToday, reviewStreak: mockUser.reviewStreak };
}

export function getItemStats(): ItemStats {
  return {
    totalItems: mockItems.length,
    favoriteItems: mockItems.filter((item) => item.isFavorite).length,
  };
}

function withType(items: MockItem[]): ItemWithType[] {
  return items.flatMap((item) => {
    const type = itemTypesById.get(item.itemTypeId);
    return type ? [{ item, type }] : [];
  });
}

export function getPinnedItems(): ItemWithType[] {
  return withType(mockItems.filter((item) => item.isPinned).sort(byUpdatedAtDesc));
}

export function getRecentItems(): ItemWithType[] {
  return withType([...mockItems].sort(byUpdatedAtDesc).slice(0, RECENT_ITEMS_LIMIT));
}

function getUrlHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

// First body line of markdown (headings usually repeat the title), without emphasis markers
function getTextPreview(content: string): string {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("```"));
  const firstLine = lines.find((line) => !line.startsWith("#")) ?? lines[0] ?? "";
  // Underscores are left alone: they are LaTeX subscripts far more often than emphasis here
  return firstLine.replace(/^#+\s*/, "").replace(/^[-*]\s+/, "").replace(/[*`]/g, "");
}

export function getItemPreview(item: MockItem): string {
  switch (item.contentType) {
    case "URL":
      return item.url ? getUrlHost(item.url) : "";
    case "FILE":
      return item.fileName ?? "";
    case "TEXT":
      return item.content ? getTextPreview(item.content) : "";
  }
}
