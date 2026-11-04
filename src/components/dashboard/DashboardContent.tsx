import Link from "next/link";
import { connection } from "next/server";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { ItemCard } from "@/components/items/ItemCard";
import {
  getDashboardStats,
  getPinnedItems,
  getRecentCollections,
  getRecentItems,
  getReviewSummary,
  getUpcomingExams,
} from "@/lib/dashboard";
import { getTodayInTimeZone } from "@/lib/dates";
import { mockUser } from "@/lib/mock-data";
import { DashboardSection } from "./DashboardSection";
import { ReviewBanner } from "./ReviewBanner";
import { StatsCards } from "./StatsCards";
import { UpcomingExams } from "./UpcomingExams";

// grid-cols-1 (minmax(0, 1fr)) lets cards shrink below their truncated title width on mobile
const ITEM_GRID = "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3";

// Reads the current time, so it renders at request time inside a Suspense boundary
export async function DashboardContent() {
  await connection();
  const today = getTodayInTimeZone(new Date(), mockUser.timezone);

  const review = getReviewSummary();
  const pinnedItems = getPinnedItems();

  return (
    <div className="mx-auto flex min-w-0 max-w-6xl flex-col gap-8">
      <ReviewBanner cardsDue={review.cardsDue} reviewStreak={review.reviewStreak} />
      <StatsCards stats={getDashboardStats()} />
      <UpcomingExams exams={getUpcomingExams(today)} />

      <DashboardSection
        title="Recent collections"
        action={
          <Link href="/collections" className="text-sm text-muted-foreground hover:text-foreground">
            View all
          </Link>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {getRecentCollections().map((summary) => (
            <CollectionCard key={summary.collection.id} summary={summary} />
          ))}
        </div>
      </DashboardSection>

      {pinnedItems.length > 0 && (
        <DashboardSection title="Pinned">
          <div className={ITEM_GRID}>
            {pinnedItems.map((entry) => (
              <ItemCard key={entry.item.id} entry={entry} today={today} />
            ))}
          </div>
        </DashboardSection>
      )}

      <DashboardSection title="Recent items">
        <div className={ITEM_GRID}>
          {getRecentItems().map((entry) => (
            <ItemCard key={entry.item.id} entry={entry} today={today} />
          ))}
        </div>
      </DashboardSection>
    </div>
  );
}
