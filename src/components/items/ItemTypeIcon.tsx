import { createElement, type ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";
import { getItemTypeIcon } from "@/lib/item-types";

interface ItemTypeIconProps extends ComponentProps<LucideIcon> {
  icon: string;
}

// Renders the Lucide icon stored on ItemType.icon (e.g. "NotebookPen")
export function ItemTypeIcon({ icon, ...props }: ItemTypeIconProps) {
  return createElement(getItemTypeIcon(icon), props);
}
