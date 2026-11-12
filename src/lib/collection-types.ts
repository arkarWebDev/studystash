// Pure helpers that summarize the item types inside a collection.

import type { ItemTypeInfo, TypeSummary } from "@/types/collection";

export interface TypedItem {
  type: ItemTypeInfo;
  updatedAt: Date;
}

interface TypeTally {
  summary: TypeSummary;
  latestUpdatedAt: number;
}

// Every type in the items, most used first; ties go to the type of the most recently updated item
export function summarizeTypes(items: readonly TypedItem[]): TypeSummary[] {
  const tallies = new Map<string, TypeTally>();

  for (const { type, updatedAt } of items) {
    const updatedAtMs = updatedAt.getTime();
    const tally = tallies.get(type.slug);
    if (tally) {
      tally.summary.count += 1;
      tally.latestUpdatedAt = Math.max(tally.latestUpdatedAt, updatedAtMs);
    } else {
      tallies.set(type.slug, { summary: { ...type, count: 1 }, latestUpdatedAt: updatedAtMs });
    }
  }

  return [...tallies.values()]
    .sort((a, b) => b.summary.count - a.summary.count || b.latestUpdatedAt - a.latestUpdatedAt)
    .map((tally) => tally.summary);
}

// The type with the most items, or null for an empty collection
export function getDominantType(items: readonly TypedItem[]): TypeSummary | null {
  return summarizeTypes(items)[0] ?? null;
}
