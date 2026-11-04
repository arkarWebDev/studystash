import { Pin, Star } from "lucide-react";
import { getItemPreview, type ItemWithType } from "@/lib/dashboard";
import { formatRelativeDay } from "@/lib/dates";
import { getItemTypeBorderColor, getItemTypeTextColor } from "@/lib/item-types";
import { cn } from "@/lib/utils";
import { ItemTypeIcon } from "./ItemTypeIcon";

interface ItemCardProps {
  entry: ItemWithType;
  today: string;
}

export function ItemCard({ entry, today }: ItemCardProps) {
  const { item, type } = entry;
  const preview = getItemPreview(item);
  const isFormula = type.name === "formula";

  return (
    <article
      className={cn(
        "flex min-w-0 flex-col gap-2 rounded-xl border bg-card p-4 transition-colors",
        getItemTypeBorderColor(type.name),
      )}
    >
      <div className="flex items-start gap-2">
        <ItemTypeIcon
          icon={type.icon}
          className={cn("mt-0.5 size-4 shrink-0", getItemTypeTextColor(type.name))}
          role="img"
          aria-label={type.name}
        />
        <h3 className="min-w-0 flex-1 truncate font-medium">{item.title}</h3>
        <div className="flex shrink-0 items-center gap-1 text-muted-foreground">
          {item.isPinned && <Pin className="size-3.5" aria-label="Pinned" />}
          {item.isFavorite && <Star className="size-3.5 fill-current text-type-question" aria-label="Favorite" />}
        </div>
      </div>
      {preview && (
        <p className={cn("line-clamp-2 text-sm break-words text-muted-foreground", isFormula && "font-mono text-xs")}>{preview}</p>
      )}
      <p className="mt-auto text-xs text-muted-foreground">
        <time dateTime={item.updatedAt}>{formatRelativeDay(item.updatedAt, today)}</time>
      </p>
    </article>
  );
}
