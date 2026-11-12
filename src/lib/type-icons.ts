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
const TYPE_ICONS: Record<string, LucideIcon> = {
  NotebookPen,
  Layers,
  Sigma,
  CircleHelp,
  Link: LinkIcon,
  Video,
  File: FileIcon,
  Image: ImageIcon,
};

export function getTypeIcon(iconName: string): LucideIcon {
  return TYPE_ICONS[iconName] ?? FileIcon;
}
