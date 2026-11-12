import type { ContentType } from "@/generated/prisma/client";
import type { ItemTypeInfo } from "@/types/collection";

export interface ItemCardData {
  id: string;
  title: string;
  contentType: ContentType;
  preview: string | null;
  isPinned: boolean;
  isFavorite: boolean;
  updatedAt: Date;
  type: ItemTypeInfo;
  tags: string[];
}

export interface ItemStats {
  totalItems: number;
  favoriteItems: number;
}
