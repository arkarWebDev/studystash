import { FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

// Display only: creating items is a later feature
export function ItemsEmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-8 text-center">
      <FilePlus className="size-8 text-muted-foreground" aria-hidden="true" />
      <div className="flex flex-col gap-1">
        <p className="font-medium">No items yet</p>
        <p className="text-sm text-muted-foreground">Add notes, flashcards, formulas or links to start studying.</p>
      </div>
      <Button type="button">New item</Button>
    </div>
  );
}
