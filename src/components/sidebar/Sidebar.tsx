import { Brain, Folder, FolderOpen, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ItemTypeIcon } from "@/components/items/ItemTypeIcon";
import {
  getItemTypeLabel,
  getItemTypeTextColor,
  isProItemType,
} from "@/lib/item-types";
import { mockCollections, mockItems, mockItemTypes, mockUser, type MockItem } from "@/lib/mock-data";
import { SidebarLink } from "./SidebarLink";
import { SidebarSection } from "./SidebarSection";
import { SidebarShell } from "./SidebarShell";
import { UserMenu } from "./UserMenu";

const RECENT_COLLECTIONS_LIMIT = 5;

function countItemsByType(items: MockItem[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.itemTypeId, (counts.get(item.itemTypeId) ?? 0) + 1);
  }
  return counts;
}

export function Sidebar() {
  const itemCounts = countItemsByType(mockItems);
  const favoriteCollections = mockCollections.filter((collection) => collection.isFavorite);
  const recentCollections = [...mockCollections]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, RECENT_COLLECTIONS_LIMIT);
  const cardsDue = mockUser.cardsDueToday;

  return (
    <SidebarShell>
      <ScrollArea className="min-h-0 flex-1">
        <nav aria-label="Main" className="flex flex-col gap-5 p-2">
          <SidebarSection>
            <SidebarLink
              href="/review"
              label="Review"
              icon={<Brain />}
              trailing={
                cardsDue > 0 && (
                  <Badge className="h-5 min-w-5 px-1.5 tabular-nums">
                    {cardsDue}
                    <span className="sr-only"> cards due</span>
                  </Badge>
                )
              }
            />
          </SidebarSection>

          <SidebarSection title="Item types">
            {mockItemTypes.map((type) => {
              return (
                <SidebarLink
                  key={type.id}
                  href={`/items/${type.slug}`}
                  label={getItemTypeLabel(type.slug)}
                  icon={<ItemTypeIcon icon={type.icon} className={getItemTypeTextColor(type.name)} />}
                  trailing={
                    <>
                      {isProItemType(type.name) && (
                        <Badge variant="outline" className="h-4 px-1 text-[10px]">
                          Pro
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {itemCounts.get(type.id) ?? 0}
                      </span>
                    </>
                  }
                />
              );
            })}
          </SidebarSection>

          {favoriteCollections.length > 0 && (
            <SidebarSection title="Favorites">
              {favoriteCollections.map((collection) => (
                <SidebarLink
                  key={collection.id}
                  href={`/collections/${collection.id}`}
                  label={collection.name}
                  icon={<Star className="text-muted-foreground" />}
                />
              ))}
            </SidebarSection>
          )}

          <SidebarSection title="Recent collections">
            {recentCollections.map((collection) => (
              <SidebarLink
                key={collection.id}
                href={`/collections/${collection.id}`}
                label={collection.name}
                icon={<Folder className="text-muted-foreground" />}
              />
            ))}
            <SidebarLink
              href="/collections"
              label="View all"
              icon={<FolderOpen className="text-muted-foreground" />}
            />
          </SidebarSection>
        </nav>
      </ScrollArea>

      <div className="border-t p-2">
        <UserMenu name={mockUser.name} email={mockUser.email} image={mockUser.image} />
      </div>
    </SidebarShell>
  );
}
