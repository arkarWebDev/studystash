import { connection } from "next/server";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { getCollectionStats, getRecentCollections, getUpcomingExams } from "@/lib/queries/collections";
import { getCurrentUserId, getUserTimezone } from "@/lib/queries/current-user";
import { getItemStats, getPinnedItems, getRecentItems } from "@/lib/queries/items";
import type { ComponentProps } from "react";

type DashboardData = ComponentProps<typeof DashboardContent>;

const EMPTY_DASHBOARD: DashboardData = {
  recentCollections: [],
  upcomingExams: [],
  pinnedItems: [],
  recentItems: [],
  stats: { totalItems: 0, favoriteItems: 0, totalCollections: 0, favoriteCollections: 0 },
  timeZone: "UTC",
};

async function getDashboardData(userId: string): Promise<DashboardData> {
  const [recentCollections, collectionStats, upcomingExams, pinnedItems, recentItems, itemStats, timeZone] =
    await Promise.all([
      getRecentCollections(userId),
      getCollectionStats(userId),
      getUpcomingExams(userId),
      getPinnedItems(userId),
      getRecentItems(userId),
      getItemStats(userId),
      getUserTimezone(userId),
    ]);
  return {
    recentCollections,
    upcomingExams,
    pinnedItems,
    recentItems,
    stats: { ...itemStats, ...collectionStats },
    timeZone,
  };
}

// Reads the database and the current time per request; loading.tsx is the Suspense fallback
export default async function DashboardPage() {
  await connection();
  const userId = await getCurrentUserId();
  const data = userId ? await getDashboardData(userId) : EMPTY_DASHBOARD;

  return (
    <>
      <h1 className="sr-only">Dashboard</h1>
      <DashboardContent {...data} />
    </>
  );
}
