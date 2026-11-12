import { getDominantType, summarizeTypes, type TypedItem } from "@/lib/collection-types";
import { daysBetween, getStartOfDayInTimeZone, getTodayInTimeZone } from "@/lib/dates";
import { db } from "@/lib/db";
import { getUserTimezone } from "@/lib/queries/current-user";
import type { CollectionCardData, CollectionStats, UpcomingExam } from "@/types/collection";
import type { SidebarCollection } from "@/types/sidebar";

const DEFAULT_RECENT_COLLECTIONS_LIMIT = 6;
const DEFAULT_UPCOMING_EXAMS_LIMIT = 3;

const typeInfoSelect = { slug: true, name: true, icon: true, color: true } as const;

// One query for the whole grid: collections with their items' types, no query per collection
export async function getRecentCollections(
  userId: string,
  limit = DEFAULT_RECENT_COLLECTIONS_LIMIT,
): Promise<CollectionCardData[]> {
  const collections = await db.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      description: true,
      isFavorite: true,
      examDate: true,
      defaultType: { select: typeInfoSelect },
      items: {
        where: { item: { userId } },
        select: { item: { select: { updatedAt: true, itemType: { select: typeInfoSelect } } } },
      },
    },
  });

  return collections.map(({ items, ...collection }) => {
    const typedItems: TypedItem[] = items.map(({ item }) => ({ type: item.itemType, updatedAt: item.updatedAt }));
    return {
      ...collection,
      itemCount: typedItems.length,
      dominantType: getDominantType(typedItems),
      types: summarizeTypes(typedItems),
    };
  });
}

export async function getFavoriteCollections(userId: string): Promise<SidebarCollection[]> {
  return db.collection.findMany({
    where: { userId, isFavorite: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

export async function getCollectionStats(userId: string): Promise<CollectionStats> {
  const [totalCollections, favoriteCollections] = await Promise.all([
    db.collection.count({ where: { userId } }),
    db.collection.count({ where: { userId, isFavorite: true } }),
  ]);
  return { totalCollections, favoriteCollections };
}

// Exams from the start of today (user's timezone) onwards, nearest first
export async function getUpcomingExams(
  userId: string,
  limit = DEFAULT_UPCOMING_EXAMS_LIMIT,
): Promise<UpcomingExam[]> {
  const timeZone = await getUserTimezone(userId);
  const now = new Date();
  const today = getTodayInTimeZone(now, timeZone);

  const collections = await db.collection.findMany({
    where: { userId, examDate: { gte: getStartOfDayInTimeZone(now, timeZone) } },
    orderBy: { examDate: "asc" },
    take: limit,
    select: { id: true, name: true, examDate: true },
  });

  return collections.flatMap(({ examDate, ...collection }) =>
    examDate
      ? [{ ...collection, examDate, daysUntil: daysBetween(today, getTodayInTimeZone(examDate, timeZone)) }]
      : [],
  );
}
