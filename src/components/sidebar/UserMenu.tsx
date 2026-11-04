"use client";

import { ChevronsUpDown, LogOut, Moon, Settings, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { use } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";
import { SidebarRailContext } from "./SidebarProvider";

const MAX_INITIALS = 2;

interface UserMenuProps {
  name: string;
  email: string;
  image: string | null;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, MAX_INITIALS)
    .toUpperCase();
}

export function UserMenu({ name, email, image }: UserMenuProps) {
  const isCollapsed = use(SidebarRailContext);
  const { setIsMobileOpen } = useSidebar();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={isCollapsed ? `Account menu for ${name}` : undefined}
          className={cn(
            "flex w-full items-center gap-2 rounded-md p-1.5 text-left outline-none transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring",
            isCollapsed && "justify-center",
          )}
        >
          <Avatar className="size-7">
            {image && <AvatarImage src={image} alt="" />}
            <AvatarFallback className="text-xs">{getInitials(name)}</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{name}</span>
                <span className="block truncate text-xs text-muted-foreground">{email}</span>
              </span>
              <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={isCollapsed ? "right" : "top"} align={isCollapsed ? "end" : "start"} className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/settings" onClick={() => setIsMobileOpen(false)}>
            <Settings aria-hidden="true" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            setTheme(isDark ? "light" : "dark");
          }}
        >
          {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          {isDark ? "Light mode" : "Dark mode"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut aria-hidden="true" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
