export interface ReviewSummary {
  cardsDueToday: number;
  reviewStreak: number; // 0 unless the last review was today or yesterday
}
