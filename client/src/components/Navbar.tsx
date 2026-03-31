"use client";

import Link from "next/link";
import { Bell, Moon, PanelLeftClose, PanelLeftOpen, Search, Sun } from "lucide-react";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/app/state";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          aria-label="Toggle sidebar"
        >
          {isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Workspace overview
          </p>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            Project Management Dashboard
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Search size={16} />
          <span className="hidden md:inline">Search</span>
        </Link>
        <button
          type="button"
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}
