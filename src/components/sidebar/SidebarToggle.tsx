"use client";

import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/useSidebar";

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle sidebar">
      <PanelLeft aria-hidden="true" />
    </Button>
  );
}
