import { connection } from "next/server";
import { Suspense } from "react";
import { TopBar } from "@/components/dashboard/TopBar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { SidebarProvider } from "@/components/sidebar/SidebarProvider";
import { SidebarSkeleton } from "@/components/sidebar/SidebarSkeleton";
import { getFavoriteCollections, getRecentCollections } from "@/lib/queries/collections";
import { getCurrentUser, getCurrentUserId } from "@/lib/queries/current-user";
import { getSidebarItemTypes } from "@/lib/queries/item-types";
import { getReviewSummary } from "@/lib/queries/review";
import type { SidebarData } from "@/types/sidebar";

const SIDEBAR_RECENT_COLLECTIONS_LIMIT = 5;

const EMPTY_SIDEBAR: SidebarData = {
  cardsDueToday: 0,
  itemTypes: [],
  favoriteCollections: [],
  recentCollections: [],
  user: null,
};

async function getSidebarData(userId: string): Promise<SidebarData> {
  const [review, itemTypes, favoriteCollections, recentCollections, user] = await Promise.all([
    getReviewSummary(userId),
    getSidebarItemTypes(userId),
    getFavoriteCollections(userId),
    getRecentCollections(userId, SIDEBAR_RECENT_COLLECTIONS_LIMIT),
    getCurrentUser(),
  ]);

  return {
    cardsDueToday: review.cardsDueToday,
    itemTypes,
    favoriteCollections,
    recentCollections: recentCollections.map(({ id, name, dominantType, defaultType }) => ({
      id,
      name,
      colorTypeName: (dominantType ?? defaultType)?.name ?? null,
    })),
    user,
  };
}

// Reads the database (and "today" for due cards) per request, so it streams in behind a skeleton
async function SidebarWithData() {
  await connection();
  const userId = await getCurrentUserId();
  const data = userId ? await getSidebarData(userId) : EMPTY_SIDEBAR;
  return <Sidebar data={data} />;
}

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <SidebarProvider>
      <div className="flex h-dvh flex-col overflow-hidden">
        <TopBar />
        <div className="flex min-h-0 flex-1">
          <Suspense fallback={<SidebarSkeleton />}>
            <SidebarWithData />
          </Suspense>
          <main className="min-w-0 flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
