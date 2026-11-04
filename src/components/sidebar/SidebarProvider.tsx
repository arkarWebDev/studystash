"use client";

import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";

const MOBILE_MEDIA_QUERY = "(max-width: 767px)";

export interface SidebarContextValue {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextValue | null>(null);

// True only inside the collapsed desktop rail, where links render icon-only
export const SidebarRailContext = createContext(false);

interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    if (window.matchMedia(MOBILE_MEDIA_QUERY).matches) {
      setIsMobileOpen((isOpen) => !isOpen);
    } else {
      setIsCollapsed((collapsed) => !collapsed);
    }
  }, []);

  const value = useMemo(
    () => ({ isCollapsed, isMobileOpen, setIsMobileOpen, toggleSidebar }),
    [isCollapsed, isMobileOpen, toggleSidebar],
  );

  return <SidebarContext value={value}>{children}</SidebarContext>;
}
