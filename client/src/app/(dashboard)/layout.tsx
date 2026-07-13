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
    <div className="flex min-h-screen w-full bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar />
      <main
        className={`flex min-w-0 w-full flex-col transition-[padding] duration-200 ${
          isSidebarCollapsed ? "md:pl-[4.5rem]" : "md:pl-60"
        }`}
      >
        <Navbar />
        <div className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-5 sm:px-6 md:px-8 md:py-7">
          {children}
        </div>
      </main>
    </div>
  );
}
