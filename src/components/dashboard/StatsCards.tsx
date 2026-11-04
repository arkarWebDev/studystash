import { FolderOpen, Heart, Library, Star, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/dashboard";

interface StatsCardsProps {
  stats: DashboardStats;
}

interface StatCard {
  key: keyof DashboardStats;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
}

const STAT_CARDS: StatCard[] = [
  { key: "totalItems", label: "Items", shortLabel: "Items", icon: Library },
  { key: "totalCollections", label: "Collections", shortLabel: "Collections", icon: FolderOpen },
  { key: "favoriteItems", label: "Favorite items", shortLabel: "Fav. items", icon: Star },
  { key: "favoriteCollections", label: "Favorite collections", shortLabel: "Fav. collections", icon: Heart },
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <section aria-label="Stats">
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STAT_CARDS.map(({ key, label, shortLabel, icon: Icon }) => (
          <Card key={key} className="min-w-0 gap-2 px-3 sm:px-4">
            <dt className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground sm:gap-2 sm:text-sm">
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              <span className="truncate sm:hidden" title={label}>
                {shortLabel}
              </span>
              <span className="hidden truncate sm:inline">{label}</span>
            </dt>
            <dd className="text-2xl font-semibold tabular-nums">{stats[key]}</dd>
          </Card>
        ))}
      </dl>
    </section>
  );
}
