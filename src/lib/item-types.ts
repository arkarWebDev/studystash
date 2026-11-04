import {
  CircleHelp,
  FileIcon,
  ImageIcon,
  Layers,
  LinkIcon,
  NotebookPen,
  Sigma,
  Video,
  type LucideIcon,
} from "lucide-react";

// Keyed by the Lucide icon name stored on ItemType.icon
const ITEM_TYPE_ICONS: Record<string, LucideIcon> = {
  NotebookPen,
  Layers,
  Sigma,
  CircleHelp,
  Link: LinkIcon,
  Video,
  File: FileIcon,
  Image: ImageIcon,
};

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

const PRO_ITEM_TYPES: ReadonlySet<string> = new Set(["file", "image"]);

export function getItemTypeIcon(iconName: string): LucideIcon {
  return ITEM_TYPE_ICONS[iconName] ?? FileIcon;
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
