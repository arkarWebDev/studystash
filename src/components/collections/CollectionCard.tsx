import { Star } from "lucide-react";
import Link from "next/link";
import type { CollectionSummary } from "@/lib/dashboard";
import { ItemTypeIcon } from "@/components/items/ItemTypeIcon";
import { getItemTypeBgTint, getItemTypeLabel, getItemTypeTextColor } from "@/lib/item-types";
import { cn } from "@/lib/utils";

interface CollectionCardProps {
  summary: CollectionSummary;
}

export function CollectionCard({ summary }: CollectionCardProps) {
  const { collection, dominantType, types } = summary;

  return (
    <Link
      href={`/collections/${collection.id}`}
      className={cn(
        "flex min-w-0 flex-col gap-3 rounded-xl border p-4 outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
        getItemTypeBgTint(dominantType?.name),
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="truncate font-medium">{collection.name}</h3>
        {collection.isFavorite && (
          <Star className="size-4 shrink-0 fill-current text-type-question" aria-label="Favorite" />
        )}
      </div>
      <p className="truncate text-sm text-muted-foreground">{collection.description ?? "No description"}</p>
      <div className="mt-auto flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground tabular-nums">
          {collection.itemCount} {collection.itemCount === 1 ? "item" : "items"}
        </span>
        <ul className="flex items-center gap-1.5" aria-label="Item types">
          {types.map((type) => (
            <li key={type.id}>
              <ItemTypeIcon
                icon={type.icon}
                className={cn("size-3.5", getItemTypeTextColor(type.name))}
                role="img"
                aria-label={getItemTypeLabel(type.slug)}
              />
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
