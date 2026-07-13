"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  FolderKanban,
  Gauge,
  Search,
  Settings,
  TimerReset,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import {
  selectIsMobileSidebarOpen,
  selectIsSidebarCollapsed,
  setIsMobileSidebarOpen,
} from "@/features/app-shell/store/appShellSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

const navItems = [
  { href: "/home", label: "Overview", icon: Gauge },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/timeline", label: "Timeline", icon: TimerReset },
  { href: "/search", label: "Search", icon: Search },
  { href: "/users", label: "Users", icon: Users },
  { href: "/teams", label: "Teams", icon: UsersRound },
];

const utilityItems = [
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isSidebarCollapsed = useAppSelector(selectIsSidebarCollapsed);
  const isMobileSidebarOpen = useAppSelector(selectIsMobileSidebarOpen);

  const renderNav = () => (
    <>
      <div className="mb-6 flex h-10 items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--foreground)] text-[var(--surface)]">
            <Boxes size={16} aria-hidden="true" />
          </div>
          {!isSidebarCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                SaaS Manager
              </p>
              <p className="truncate text-[11px] text-[var(--muted)]">
                Delivery workspace
              </p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => dispatch(setIsMobileSidebarOpen(false))}
          className="ui-icon-button md:hidden"
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Workspace navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => dispatch(setIsMobileSidebarOpen(false))}
              title={isSidebarCollapsed ? label : undefined}
              className={`flex min-h-10 items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium ${
                isActive
                  ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "text-[var(--muted-strong)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <Icon size={18} />
              {!isSidebarCollapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>
      <nav className="mt-4 border-t border-[var(--border)] pt-3" aria-label="Workspace utilities">
        {utilityItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => dispatch(setIsMobileSidebarOpen(false))}
              title={isSidebarCollapsed ? label : undefined}
              className={`flex min-h-10 items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium ${
                isActive
                  ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "text-[var(--muted-strong)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
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
        className={`fixed inset-0 z-30 bg-[var(--overlay)] transition-opacity md:hidden ${
          isMobileSidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => dispatch(setIsMobileSidebarOpen(false))}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-[var(--border)] bg-[var(--surface)] px-3 py-4 shadow-[0_24px_70px_-24px_rgb(15_23_42_/_0.4)] transition-all md:z-30 md:shadow-none ${
          isSidebarCollapsed ? "md:w-[4.5rem]" : "md:w-60"
        } ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-[18rem] md:translate-x-0`}
      >
        {renderNav()}
      </aside>
    </>
  );
}
