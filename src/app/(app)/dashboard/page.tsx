import { connection } from "next/server";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { getItemStats } from "@/lib/dashboard";
import { getCollectionStats, getRecentCollections, getUpcomingExams } from "@/lib/queries/collections";
import { getCurrentUserId } from "@/lib/queries/current-user";
import type { CollectionCardData, CollectionStats, UpcomingExam } from "@/types/collection";

interface CollectionData {
  recentCollections: CollectionCardData[];
  collectionStats: CollectionStats;
  upcomingExams: UpcomingExam[];
}

const NO_COLLECTION_DATA: CollectionData = {
  recentCollections: [],
  collectionStats: { totalCollections: 0, favoriteCollections: 0 },
  upcomingExams: [],
};

async function getCollectionData(userId: string): Promise<CollectionData> {
  const [recentCollections, collectionStats, upcomingExams] = await Promise.all([
    getRecentCollections(userId),
    getCollectionStats(userId),
    getUpcomingExams(userId),
  ]);
  return { recentCollections, collectionStats, upcomingExams };
}

// Reads the database and the current time per request; loading.tsx is the Suspense fallback
export default async function DashboardPage() {
  await connection();
  const userId = await getCurrentUserId();
  const { recentCollections, collectionStats, upcomingExams } = userId
    ? await getCollectionData(userId)
    : NO_COLLECTION_DATA;

  return (
    <>
      <h1 className="sr-only">Dashboard</h1>
      <DashboardContent
        recentCollections={recentCollections}
        stats={{ ...getItemStats(), ...collectionStats }}
        upcomingExams={upcomingExams}
      />
    </>
  );
}
