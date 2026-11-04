import { Skeleton } from "@/components/ui/skeleton";

const STAT_PLACEHOLDERS = ["items", "collections", "favorite-items", "favorite-collections"];
const CARD_PLACEHOLDERS = ["a", "b", "c", "d", "e", "f"];

export function DashboardSkeleton() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8" aria-busy="true" aria-label="Loading dashboard">
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STAT_PLACEHOLDERS.map((key) => (
          <Skeleton key={key} className="h-20 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CARD_PLACEHOLDERS.map((key) => (
          <Skeleton key={key} className="h-32 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
