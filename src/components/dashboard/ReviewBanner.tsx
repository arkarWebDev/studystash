import { Brain, CircleCheck, Flame } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ReviewBannerProps {
  cardsDue: number;
  reviewStreak: number;
}

export function ReviewBanner({ cardsDue, reviewStreak }: ReviewBannerProps) {
  const hasCardsDue = cardsDue > 0;

  return (
    <section
      aria-label="Review"
      className="flex flex-col gap-4 rounded-xl border bg-type-flashcard/10 p-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-type-flashcard/15 text-type-flashcard">
          {hasCardsDue ? <Brain className="size-5" aria-hidden="true" /> : <CircleCheck className="size-5" aria-hidden="true" />}
        </span>
        <div className="flex flex-col gap-0.5">
          <p className="text-lg font-semibold">
            {hasCardsDue ? `${cardsDue} ${cardsDue === 1 ? "card" : "cards"} due today` : "You're all caught up"}
          </p>
          {reviewStreak > 0 && (
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <Flame className="size-4 text-type-formula" aria-hidden="true" />
              {reviewStreak}-day streak
            </p>
          )}
        </div>
      </div>
      {hasCardsDue && (
        <Button asChild size="lg" className="sm:shrink-0">
          <Link href="/review">Start Review</Link>
        </Button>
      )}
    </section>
  );
}
