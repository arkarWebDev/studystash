export interface ItemTypeInfo {
  slug: string;
  name: string;
  icon: string;
  color: string;
}

export interface TypeSummary extends ItemTypeInfo {
  count: number;
}

export interface CollectionCardData {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  examDate: Date | null;
  itemCount: number;
  dominantType: TypeSummary | null; // null when the collection is empty
  defaultType: ItemTypeInfo | null; // tints the card when the collection is empty
  types: TypeSummary[]; // every type in the collection, most used first
}

export interface CollectionStats {
  totalCollections: number;
  favoriteCollections: number;
}

export interface UpcomingExam {
  id: string;
  name: string;
  examDate: Date;
  daysUntil: number; // calendar days in the user's timezone; 0 = today
}
