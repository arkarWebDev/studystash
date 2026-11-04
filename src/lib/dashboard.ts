// Dashboard data selection over mock data. Swap these for Prisma queries once the database exists.

import { daysBetween } from "@/lib/dates";
import {
  mockCollections,
  mockItems,
  mockItemTypes,
  mockUser,
  type MockCollection,
  type MockItem,
  type MockItemType,
} from "@/lib/mock-data";

const UPCOMING_EXAMS_LIMIT = 3;
const RECENT_COLLECTIONS_LIMIT = 6;
const RECENT_ITEMS_LIMIT = 10;

export interface ReviewSummary {
  cardsDue: number;
  reviewStreak: number;
}

export interface DashboardStats {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

export interface UpcomingExam {
  collection: MockCollection;
  daysUntil: number;
}

export interface CollectionSummary {
  collection: MockCollection;
  dominantType: MockItemType | null;
  types: MockItemType[];
}

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

export function getDashboardStats(): DashboardStats {
  return {
    totalItems: mockItems.length,
    totalCollections: mockCollections.length,
    favoriteItems: mockItems.filter((item) => item.isFavorite).length,
    favoriteCollections: mockCollections.filter((collection) => collection.isFavorite).length,
  };
}

// Exams from today onwards, nearest first
export function getUpcomingExams(today: string): UpcomingExam[] {
  return mockCollections
    .flatMap((collection) =>
      collection.examDate ? [{ collection, daysUntil: daysBetween(today, collection.examDate) }] : [],
    )
    .filter((exam) => exam.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, UPCOMING_EXAMS_LIMIT);
}

function getCollectionItems(collectionId: string): MockItem[] {
  return mockItems.filter((item) => item.collectionIds.includes(collectionId));
}

// The type the collection contains most of; ties go to the type listed first
export function getDominantType(items: MockItem[]): MockItemType | null {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.itemTypeId, (counts.get(item.itemTypeId) ?? 0) + 1);
  }

  let dominant: MockItemType | null = null;
  let highestCount = 0;
  for (const type of mockItemTypes) {
    const count = counts.get(type.id) ?? 0;
    if (count > highestCount) {
      dominant = type;
      highestCount = count;
    }
  }
  return dominant;
}

export function getRecentCollections(): CollectionSummary[] {
  return [...mockCollections]
    .sort(byUpdatedAtDesc)
    .slice(0, RECENT_COLLECTIONS_LIMIT)
    .map((collection) => {
      const items = getCollectionItems(collection.id);
      const typeIds = new Set(items.map((item) => item.itemTypeId));
      return {
        collection,
        dominantType: getDominantType(items),
        types: mockItemTypes.filter((type) => typeIds.has(type.id)),
      };
    });
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
