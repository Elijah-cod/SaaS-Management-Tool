"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sun,
} from "lucide-react";
import {
  selectIsDarkMode,
  selectIsSidebarCollapsed,
  setIsDarkMode,
  setIsMobileSidebarOpen,
  setIsSidebarCollapsed,
} from "@/features/app-shell/store/appShellSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isDarkMode = useAppSelector(selectIsDarkMode);
  const isSidebarCollapsed = useAppSelector(selectIsSidebarCollapsed);
  const routeTitle =
    [
      ["/projects", "Projects"],
      ["/timeline", "Timeline"],
      ["/search", "Search"],
      ["/users", "Members"],
      ["/teams", "Teams"],
      ["/settings", "Settings"],
    ].find(([route]) => pathname.startsWith(route))?.[1] ?? "Overview";

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]/95 px-4 py-2.5 backdrop-blur md:px-6">
      <div className="flex min-h-10 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => dispatch(setIsMobileSidebarOpen(true))}
            className="ui-icon-button md:hidden"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
          <button
            type="button"
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            className="ui-icon-button hidden md:inline-flex"
            aria-label="Toggle sidebar"
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>
          <h1 className="truncate text-sm font-semibold tracking-[-0.01em] text-[var(--foreground)] sm:text-base">
            {routeTitle}
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden text-right lg:block">
            <p className="text-xs font-semibold text-[var(--foreground)]">
              {status === "loading"
                ? "Loading workspace..."
                : session?.user.name ?? "Workspace user"}
            </p>
            <p className="text-[11px] text-[var(--muted)]">
              {status === "loading"
                ? "Syncing session"
                : session?.user.role ?? "Signed in"}
            </p>
          </div>
          <Link
            href="/search"
            className="ui-button-secondary hidden sm:inline-flex"
          >
            <Search size={16} />
            <span>Search</span>
            <kbd className="ml-1 hidden rounded border border-[var(--border)] bg-[var(--surface-muted)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--muted)] xl:inline">/</kbd>
          </Link>
          <button
            type="button"
            onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
            className="ui-icon-button"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="ui-icon-button"
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
