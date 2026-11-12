// Pure streak helper. Callers pass `now` in so it stays side-effect free.

import { daysBetween, getTodayInTimeZone } from "@/lib/dates";

const MAX_DAYS_SINCE_REVIEW = 1; // reviewed today or yesterday keeps the streak alive

// The stored streak only counts while the last review was today or yesterday in the user's timezone
export function getActiveStreak(
  reviewStreak: number,
  lastReviewedAt: Date | null,
  now: Date,
  timeZone: string,
): number {
  if (!lastReviewedAt) return 0;
  const daysSinceReview = daysBetween(
    getTodayInTimeZone(lastReviewedAt, timeZone),
    getTodayInTimeZone(now, timeZone),
  );
  return daysSinceReview >= 0 && daysSinceReview <= MAX_DAYS_SINCE_REVIEW ? reviewStreak : 0;
}
