import { Skeleton } from "@/components/ui/skeleton";
import { SidebarShell } from "./SidebarShell";

const LINK_PLACEHOLDERS = ["review", "t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "c1", "c2", "c3"];

// Same shell (rail + drawer) as the real sidebar while its data streams in
export function SidebarSkeleton() {
  return (
    <SidebarShell>
      <div className="flex flex-1 flex-col gap-1.5 p-2" aria-busy="true" aria-label="Loading sidebar">
        {LINK_PLACEHOLDERS.map((key) => (
          <Skeleton key={key} className="h-7 w-full rounded-md" />
        ))}
      </div>
      <div className="border-t p-2">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </SidebarShell>
  );
}
