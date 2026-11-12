import { CalendarClock } from "lucide-react";
import { formatExamCountdown } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { UpcomingExam } from "@/types/collection";
import { DashboardSection } from "./DashboardSection";

const URGENT_DAYS = 7;

interface UpcomingExamsProps {
  exams: UpcomingExam[];
}

export function UpcomingExams({ exams }: UpcomingExamsProps) {
  if (exams.length === 0) {
    return null;
  }

  return (
    <DashboardSection title="Upcoming exams">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {exams.map(({ id, name, daysUntil }) => (
          <li key={id} className="flex min-w-0 items-center gap-3 rounded-xl border bg-card p-4">
            <CalendarClock className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div className="min-w-0">
              <p className="truncate font-medium">{name}</p>
              <p
                className={cn(
                  "text-sm text-muted-foreground",
                  daysUntil <= URGENT_DAYS && "font-medium text-destructive",
                )}
              >
                {formatExamCountdown(daysUntil)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </DashboardSection>
  );
}
