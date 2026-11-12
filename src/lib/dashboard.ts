// Dashboard data that is still mock. Collections and items come from the database (src/lib/queries/).

import { mockUser } from "@/lib/mock-data";
import type { CollectionStats } from "@/types/collection";
import type { ItemStats } from "@/types/item";

export interface ReviewSummary {
  cardsDue: number;
  reviewStreak: number;
}

export type DashboardStats = ItemStats & CollectionStats;

export function getReviewSummary(): ReviewSummary {
  return { cardsDue: mockUser.cardsDueToday, reviewStreak: mockUser.reviewStreak };
}
