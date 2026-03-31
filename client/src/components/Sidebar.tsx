"use client";

import Link from "next/link";
import { FolderKanban, House, Search, Settings, TimerReset, Users, UsersRound } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";

const navItems = [
  { href: "/home", label: "Home", icon: House },
  { href: "/projects/1", label: "Projects", icon: FolderKanban },
  { href: "/timeline", label: "Timeline", icon: TimerReset },
  { href: "/search", label: "Search", icon: Search },
  { href: "/users", label: "Users", icon: Users },
  { href: "/teams", label: "Teams", icon: UsersRound },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 hidden border-r border-slate-200 bg-white px-3 py-4 transition-all dark:border-slate-800 dark:bg-slate-950 md:flex md:flex-col ${
        isSidebarCollapsed ? "md:w-20" : "md:w-64"
      }`}
    >
      <div className="mb-8 flex items-center gap-3 px-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
          PM
        </div>
        {!isSidebarCollapsed && (
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              SaaS Manager
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Team workspace
            </p>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <Icon size={18} />
            {!isSidebarCollapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
