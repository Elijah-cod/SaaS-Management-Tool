"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  Bell,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sun,
} from "lucide-react";
import {
  setIsDarkMode,
  setIsMobileSidebarOpen,
  setIsSidebarCollapsed,
} from "@/app/state";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85 md:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => dispatch(setIsMobileSidebarOpen(true))}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
          <button
            type="button"
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 md:inline-flex"
            aria-label="Toggle sidebar"
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium uppercase tracking-[0.18em] text-slate-400 sm:text-sm">
              Workspace overview
            </p>
            <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Project Management Dashboard
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden text-right md:block">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {session?.user.name ?? "Workspace user"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {session?.user.role ?? "Signed in"}
            </p>
          </div>
          <Link
            href="/search"
            className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:bg-slate-800 sm:inline-flex"
          >
            <Search size={16} />
            <span>Search</span>
          </Link>
          <button
            type="button"
            onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
