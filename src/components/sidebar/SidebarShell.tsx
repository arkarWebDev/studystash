"use client";

import type { ReactNode } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";
import { SidebarRailContext } from "./SidebarProvider";

interface SidebarShellProps {
  children: ReactNode;
}

// Renders the same sidebar content as a collapsible rail on desktop and a drawer on mobile
export function SidebarShell({ children }: SidebarShellProps) {
  const { isCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();

  return (
    <>
      <aside
        aria-label="Sidebar"
        data-collapsed={isCollapsed}
        className={cn(
          "group/sidebar hidden shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground transition-[width] duration-200 motion-reduce:transition-none md:flex",
          isCollapsed ? "w-14" : "w-64",
        )}
      >
        <SidebarRailContext value={isCollapsed}>{children}</SidebarRailContext>
      </aside>

      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="w-72 gap-0 bg-sidebar p-0 text-sidebar-foreground md:hidden">
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle>StudyStash</SheetTitle>
            <SheetDescription className="sr-only">Main navigation</SheetDescription>
          </SheetHeader>
          <SidebarRailContext value={false}>{children}</SidebarRailContext>
        </SheetContent>
      </Sheet>
    </>
  );
}
