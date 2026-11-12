import { Pin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatRelativeDay, getTodayInTimeZone } from "@/lib/dates";
import { getItemTypeBorderColor, getItemTypeTextColor } from "@/lib/item-types";
import { cn } from "@/lib/utils";
import type { ItemCardData } from "@/types/item";
import { ItemTypeIcon } from "./ItemTypeIcon";

const MAX_VISIBLE_TAGS = 3;

interface ItemCardProps {
  item: ItemCardData;
  today: string; // YYYY-MM-DD in the user's timezone
  timeZone: string;
}

export function ItemCard({ item, today, timeZone }: ItemCardProps) {
  const { type } = item;
  const isFormula = type.name === "formula";
  const visibleTags = item.tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTagCount = item.tags.length - visibleTags.length;

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
      {item.preview && (
        <p className={cn("line-clamp-2 text-sm break-words text-muted-foreground", isFormula && "font-mono text-xs")}>
          {item.preview}
        </p>
      )}
      <div className="mt-auto flex min-w-0 items-center justify-between gap-2">
        <p className="shrink-0 text-xs text-muted-foreground">
          <time dateTime={item.updatedAt.toISOString()}>
            {formatRelativeDay(getTodayInTimeZone(item.updatedAt, timeZone), today)}
          </time>
        </p>
        {item.tags.length > 0 && (
          <ul className="flex min-w-0 items-center justify-end gap-1 overflow-hidden" aria-label="Tags">
            {visibleTags.map((tag) => (
              <li key={tag} className="min-w-0">
                <Badge variant="secondary" className="max-w-24 truncate px-1.5 text-[10px] font-normal">
                  {tag}
                </Badge>
              </li>
            ))}
            {hiddenTagCount > 0 && (
              <li>
                <Badge variant="outline" className="px-1.5 text-[10px] font-normal text-muted-foreground">
                  +{hiddenTagCount}
                  <span className="sr-only"> more tags</span>
                </Badge>
              </li>
            )}
          </ul>
        )}
      </div>
    </article>
  );
}
