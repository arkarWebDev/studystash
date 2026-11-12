import { cache } from "react";
import { db } from "@/lib/db";

// Temporary until auth exists: every query runs as the seeded demo user
const DEMO_USER_EMAIL = "demo@studystash.io";

export const getCurrentUserId = cache(async (): Promise<string | null> => {
  const user = await db.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true },
  });
  return user?.id ?? null;
});
