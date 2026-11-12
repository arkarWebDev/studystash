import { cache } from "react";
import { getEndOfDayInTimeZone } from "@/lib/dates";
import { db } from "@/lib/db";
import { getUserTimezone } from "@/lib/queries/current-user";
import { getActiveStreak } from "@/lib/streak";
import type { ReviewSummary } from "@/types/review";

// Cached per request: the sidebar badge and the dashboard banner share one result
export const getReviewSummary = cache(async (userId: string): Promise<ReviewSummary> => {
  const timeZone = await getUserTimezone(userId);
  const now = new Date();

  const [cardsDueToday, user] = await Promise.all([
    db.flashcardReview.count({
      where: { userId, dueDate: { lt: getEndOfDayInTimeZone(now, timeZone) } },
    }),
    db.user.findUnique({ where: { id: userId }, select: { reviewStreak: true, lastReviewedAt: true } }),
  ]);

  return {
    cardsDueToday,
    reviewStreak: user ? getActiveStreak(user.reviewStreak, user.lastReviewedAt, now, timeZone) : 0,
  };
});
