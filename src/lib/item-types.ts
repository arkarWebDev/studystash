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

const PRO_ITEM_TYPES: ReadonlySet<string> = new Set(["file", "image"]);

export function getItemTypeIcon(iconName: string): LucideIcon {
  return ITEM_TYPE_ICONS[iconName] ?? FileIcon;
}

export function getItemTypeTextColor(typeName: string): string {
  return ITEM_TYPE_TEXT_COLORS[typeName] ?? "text-muted-foreground";
}

export function isProItemType(typeName: string): boolean {
  return PRO_ITEM_TYPES.has(typeName);
}

export function getItemTypeLabel(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}
