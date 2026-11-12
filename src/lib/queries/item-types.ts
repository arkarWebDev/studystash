import { db } from "@/lib/db";
import { SYSTEM_TYPE_ORDER } from "@/lib/item-types";
import type { SidebarItemType } from "@/types/sidebar";

function bySystemOrder(a: { name: string }, b: { name: string }): number {
  return SYSTEM_TYPE_ORDER.indexOf(a.name) - SYSTEM_TYPE_ORDER.indexOf(b.name);
}

// All system types with the user's item count for each: two queries in total, not one per type
export async function getSidebarItemTypes(userId: string): Promise<SidebarItemType[]> {
  const [types, counts] = await Promise.all([
    db.itemType.findMany({
      where: { userId: null, isSystem: true },
      select: { id: true, slug: true, name: true, icon: true, color: true },
    }),
    db.item.groupBy({ by: ["itemTypeId"], where: { userId }, _count: { _all: true } }),
  ]);

  const countsByTypeId = new Map(counts.map((row) => [row.itemTypeId, row._count._all]));

  return types
    .map((type) => ({ ...type, itemCount: countsByTypeId.get(type.id) ?? 0 }))
    .sort(bySystemOrder);
}
