import Link from "next/link";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { CollectionsEmptyState } from "@/components/collections/CollectionsEmptyState";
import { ItemCard } from "@/components/items/ItemCard";
import { getPinnedItems, getRecentItems, getReviewSummary, type DashboardStats } from "@/lib/dashboard";
import { getTodayInTimeZone } from "@/lib/dates";
import { mockUser } from "@/lib/mock-data";
import type { CollectionCardData, UpcomingExam } from "@/types/collection";
import { DashboardSection } from "./DashboardSection";
import { ReviewBanner } from "./ReviewBanner";
import { StatsCards } from "./StatsCards";
import { UpcomingExams } from "./UpcomingExams";

// grid-cols-1 (minmax(0, 1fr)) lets cards shrink below their truncated title width on mobile
const ITEM_GRID = "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3";

interface DashboardContentProps {
  recentCollections: CollectionCardData[];
  stats: DashboardStats;
  upcomingExams: UpcomingExam[];
}

export function DashboardContent({ recentCollections, stats, upcomingExams }: DashboardContentProps) {
  // Items are still mock data, so their relative dates use the mock user's timezone
  const today = getTodayInTimeZone(new Date(), mockUser.timezone);

  const review = getReviewSummary();
  const pinnedItems = getPinnedItems();

  return (
    <div className="mx-auto flex min-w-0 max-w-6xl flex-col gap-8">
      <ReviewBanner cardsDue={review.cardsDue} reviewStreak={review.reviewStreak} />
      <StatsCards stats={stats} />
      <UpcomingExams exams={upcomingExams} />

      <DashboardSection
        title="Recent collections"
        action={
          recentCollections.length > 0 && (
            <Link href="/collections" className="text-sm text-muted-foreground hover:text-foreground">
              View all
            </Link>
          )
        }
      >
        {recentCollections.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentCollections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        ) : (
          <CollectionsEmptyState />
        )}
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
