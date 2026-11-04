import { GraduationCap, Plus, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TopBar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b px-4">
      {/* Left: matches the sidebar width on desktop so the search lines up with the main area */}
      <div className="flex shrink-0 items-center gap-2 md:w-56">
        {/* Reserved for the sidebar toggle (phase 2) */}
        <div className="size-8 shrink-0" aria-hidden="true" />
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-md font-semibold tracking-tight focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="size-4" aria-hidden="true" />
          </span>
          <span className="hidden sm:inline">StudyStash</span>
        </Link>
      </div>

      <div className="flex min-w-0 flex-1 justify-center">
        <div className="relative w-full max-w-lg">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search items, tags, collections…"
            aria-label="Search"
            className="pr-12 pl-8"
          />
          <kbd className="pointer-events-none absolute top-1/2 right-2 hidden -translate-y-1/2 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex shrink-0 justify-end md:w-56">
        <Button>
          <Plus aria-hidden="true" />
          <span className="hidden sm:inline">New Item</span>
          <span className="sr-only sm:hidden">New Item</span>
        </Button>
      </div>
    </header>
  );
}
