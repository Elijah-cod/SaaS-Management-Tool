"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { selectIsSidebarCollapsed } from "@/features/app-shell/store/appShellSlice";
import { useAppSelector } from "@/lib/hooks";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSidebarCollapsed = useAppSelector(selectIsSidebarCollapsed);

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <Sidebar />
      <main
        className={`flex min-w-0 w-full flex-col bg-slate-50 transition-[padding] duration-200 dark:bg-slate-950 ${
          isSidebarCollapsed ? "md:pl-20" : "md:pl-64"
        }`}
      >
        <Navbar />
        <div className="flex-1 p-3 sm:p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
