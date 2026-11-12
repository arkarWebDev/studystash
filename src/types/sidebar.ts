import type { ItemTypeInfo } from "@/types/collection";
import type { CurrentUser } from "@/types/user";

export interface SidebarItemType extends ItemTypeInfo {
  id: string;
  itemCount: number;
}

export interface SidebarCollection {
  id: string;
  name: string;
}

export interface SidebarRecentCollection extends SidebarCollection {
  colorTypeName: string | null; // dominant type (or default type); null = neutral gray
}

export interface SidebarData {
  cardsDueToday: number;
  itemTypes: SidebarItemType[];
  favoriteCollections: SidebarCollection[];
  recentCollections: SidebarRecentCollection[];
  user: CurrentUser | null;
}
