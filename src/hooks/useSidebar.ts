"use client";

import { use } from "react";
import { SidebarContext, type SidebarContextValue } from "@/components/sidebar/SidebarProvider";

export function useSidebar(): SidebarContextValue {
  const context = use(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used inside SidebarProvider");
  }
  return context;
}
