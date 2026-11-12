import { cache } from "react";
import { db } from "@/lib/db";
import type { CurrentUser } from "@/types/user";

// Temporary until auth exists: every query runs as the seeded demo user
const DEMO_USER_EMAIL = "demo@studystash.io";
const FALLBACK_TIMEZONE = "UTC";

export const getCurrentUserId = cache(async (): Promise<string | null> => {
  const user = await db.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true },
  });
  return user?.id ?? null;
});

// Name, email, avatar and plan for the sidebar user area
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, image: true, isPro: true },
  });
  if (!user) return null;

  const email = user.email ?? "";
  return { name: user.name ?? email, email, image: user.image, isPro: user.isPro };
});

// IANA timezone used for "today", countdowns and relative dates
export const getUserTimezone = cache(async (userId: string): Promise<string> => {
  const user = await db.user.findUnique({ where: { id: userId }, select: { timezone: true } });
  return user?.timezone ?? FALLBACK_TIMEZONE;
});
