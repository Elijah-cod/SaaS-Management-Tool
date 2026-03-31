"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  House,
  Search,
  Settings,
  TimerReset,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import { setIsMobileSidebarOpen } from "@/app/state";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

const navItems = [
  { href: "/home", label: "Home", icon: House },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/timeline", label: "Timeline", icon: TimerReset },
  { href: "/search", label: "Search", icon: Search },
  { href: "/users", label: "Users", icon: Users },
  { href: "/teams", label: "Teams", icon: UsersRound },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isMobileSidebarOpen = useAppSelector(
    (state) => state.global.isMobileSidebarOpen
  );

  const renderNav = () => (
    <>
      <div className="mb-8 flex items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
            PM
          </div>
          {!isSidebarCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-slate-900 dark:text-white">
                SaaS Manager
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                Team workspace
              </p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => dispatch(setIsMobileSidebarOpen(false))}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => dispatch(setIsMobileSidebarOpen(false))}
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              }`}
            >
              <Icon size={18} />
              {!isSidebarCollapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-sm transition md:hidden ${
          isMobileSidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => dispatch(setIsMobileSidebarOpen(false))}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white px-3 py-4 shadow-xl transition-all dark:border-slate-800 dark:bg-slate-950 md:z-30 md:shadow-none ${
          isSidebarCollapsed ? "md:w-20" : "md:w-64"
        } ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-[18rem] md:translate-x-0`}
      >
        {renderNav()}
      </aside>
    </>
  );
}
