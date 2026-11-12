import { Brain, FolderOpen, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ItemTypeIcon } from "@/components/items/ItemTypeIcon";
import { getItemTypeDotColor, getItemTypeLabel, getItemTypeTextColor, isProItemType } from "@/lib/item-types";
import { cn } from "@/lib/utils";
import type { SidebarData } from "@/types/sidebar";
import { SidebarLink } from "./SidebarLink";
import { SidebarSection } from "./SidebarSection";
import { SidebarShell } from "./SidebarShell";
import { UserMenu } from "./UserMenu";

interface SidebarProps {
  data: SidebarData;
}

export function Sidebar({ data }: SidebarProps) {
  const { cardsDueToday, itemTypes, favoriteCollections, recentCollections, user } = data;

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
                cardsDueToday > 0 && (
                  <Badge className="h-5 min-w-5 px-1.5 tabular-nums">
                    {cardsDueToday}
                    <span className="sr-only"> cards due</span>
                  </Badge>
                )
              }
            />
          </SidebarSection>

          <SidebarSection title="Item types">
            {itemTypes.map((type) => (
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
                    <span className="text-xs text-muted-foreground tabular-nums">{type.itemCount}</span>
                  </>
                }
              />
            ))}
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
                icon={
                  <span className={cn("size-2.5 rounded-full", getItemTypeDotColor(collection.colorTypeName ?? undefined))} />
                }
              />
            ))}
            <SidebarLink
              href="/collections"
              label="View all collections"
              icon={<FolderOpen className="text-muted-foreground" />}
            />
          </SidebarSection>
        </nav>
      </ScrollArea>

      {user && (
        <div className="border-t p-2">
          <UserMenu name={user.name} email={user.email} image={user.image} isPro={user.isPro} />
        </div>
      )}
    </SidebarShell>
  );
}
