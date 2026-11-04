"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { use, type ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";
import { SidebarRailContext } from "./SidebarProvider";

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: ReactNode;
  trailing?: ReactNode;
}

export function SidebarLink({ href, label, icon, trailing }: SidebarLinkProps) {
  const pathname = usePathname();
  const isCollapsed = use(SidebarRailContext);
  const { setIsMobileOpen } = useSidebar();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  const link = (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      aria-label={isCollapsed ? label : undefined}
      onClick={() => setIsMobileOpen(false)}
      className={cn(
        "flex h-8 items-center gap-2.5 rounded-md px-2 text-sm text-sidebar-foreground/80 outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        isActive && "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
        isCollapsed && "justify-center px-0",
      )}
    >
      <span className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4" aria-hidden="true">
        {icon}
      </span>
      {!isCollapsed && (
        <>
          <span className="truncate">{label}</span>
          {trailing && <span className="ml-auto flex items-center gap-1.5">{trailing}</span>}
        </>
      )}
    </Link>
  );

  if (!isCollapsed) {
    return link;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
