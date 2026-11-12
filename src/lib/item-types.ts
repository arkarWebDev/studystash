// Full class names so Tailwind can detect them; keyed by ItemType.name
const ITEM_TYPE_TEXT_COLORS: Record<string, string> = {
  note: "text-type-note",
  flashcard: "text-type-flashcard",
  formula: "text-type-formula",
  question: "text-type-question",
  link: "text-type-link",
  video: "text-type-video",
  file: "text-type-file",
  image: "text-type-image",
};

const ITEM_TYPE_BG_TINTS: Record<string, string> = {
  note: "bg-type-note/10 hover:bg-type-note/15",
  flashcard: "bg-type-flashcard/10 hover:bg-type-flashcard/15",
  formula: "bg-type-formula/10 hover:bg-type-formula/15",
  question: "bg-type-question/10 hover:bg-type-question/15",
  link: "bg-type-link/10 hover:bg-type-link/15",
  video: "bg-type-video/10 hover:bg-type-video/15",
  file: "bg-type-file/10 hover:bg-type-file/15",
  image: "bg-type-image/10 hover:bg-type-image/15",
};

const ITEM_TYPE_BORDER_COLORS: Record<string, string> = {
  note: "border-type-note/50 hover:border-type-note",
  flashcard: "border-type-flashcard/50 hover:border-type-flashcard",
  formula: "border-type-formula/50 hover:border-type-formula",
  question: "border-type-question/50 hover:border-type-question",
  link: "border-type-link/50 hover:border-type-link",
  video: "border-type-video/50 hover:border-type-video",
  file: "border-type-file/50 hover:border-type-file",
  image: "border-type-image/50 hover:border-type-image",
};

const ITEM_TYPE_DOT_COLORS: Record<string, string> = {
  note: "bg-type-note",
  flashcard: "bg-type-flashcard",
  formula: "bg-type-formula",
  question: "bg-type-question",
  link: "bg-type-link",
  video: "bg-type-video",
  file: "bg-type-file",
  image: "bg-type-image",
};

// System types in display order (matches the seed table)
export const SYSTEM_TYPE_ORDER: readonly string[] = [
  "note",
  "flashcard",
  "formula",
  "question",
  "link",
  "video",
  "file",
  "image",
];

const PRO_ITEM_TYPES: ReadonlySet<string> = new Set(["file", "image"]);

// Solid fill for small color dots; neutral gray when there is no type
export function getItemTypeDotColor(typeName: string | undefined): string {
  return (typeName && ITEM_TYPE_DOT_COLORS[typeName]) || "bg-muted-foreground/40";
}

export function getItemTypeTextColor(typeName: string): string {
  return ITEM_TYPE_TEXT_COLORS[typeName] ?? "text-muted-foreground";
}

export function getItemTypeBgTint(typeName: string | undefined): string {
  return (typeName && ITEM_TYPE_BG_TINTS[typeName]) || "bg-card hover:bg-accent";
}

export function getItemTypeBorderColor(typeName: string): string {
  return ITEM_TYPE_BORDER_COLORS[typeName] ?? "border-border";
}

export function isProItemType(typeName: string): boolean {
  return PRO_ITEM_TYPES.has(typeName);
}

export function getItemTypeLabel(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}
