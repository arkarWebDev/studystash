// Pure date helpers. Callers pass `now` in so these stay side-effect free.
// Dates are compared as calendar days (YYYY-MM-DD) in the user's timezone.

const MS_PER_DAY = 86_400_000;
const DAYS_PER_WEEK = 7;
const DAYS_PER_MONTH = 30;
const DAYS_PER_YEAR = 365;

const relativeTimeFormat = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function getTodayInTimeZone(now: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

// Whole calendar days from `from` to `to` (both YYYY-MM-DD); negative when `to` is earlier
export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(to) - Date.parse(from)) / MS_PER_DAY);
}

export function formatExamCountdown(daysUntil: number): string {
  if (daysUntil === 0) return "Today";
  if (daysUntil === 1) return "Tomorrow";
  return `in ${daysUntil} days`;
}

// "Today", "Yesterday", "3 days ago", "2 weeks ago", …
export function formatRelativeDay(date: string, today: string): string {
  const daysAgo = daysBetween(date, today);
  let formatted: string;

  if (daysAgo < DAYS_PER_WEEK) {
    formatted = relativeTimeFormat.format(-daysAgo, "day");
  } else if (daysAgo < DAYS_PER_MONTH) {
    formatted = relativeTimeFormat.format(-Math.floor(daysAgo / DAYS_PER_WEEK), "week");
  } else if (daysAgo < DAYS_PER_YEAR) {
    formatted = relativeTimeFormat.format(-Math.floor(daysAgo / DAYS_PER_MONTH), "month");
  } else {
    formatted = relativeTimeFormat.format(-Math.floor(daysAgo / DAYS_PER_YEAR), "year");
  }

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
