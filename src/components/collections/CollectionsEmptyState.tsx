import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

// Display only: creating collections is a later feature
export function CollectionsEmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-8 text-center">
      <FolderPlus className="size-8 text-muted-foreground" aria-hidden="true" />
      <div className="flex flex-col gap-1">
        <p className="font-medium">No collections yet</p>
        <p className="text-sm text-muted-foreground">Group your notes, flashcards and files by course or exam.</p>
      </div>
      <Button type="button">Create collection</Button>
    </div>
  );
}
