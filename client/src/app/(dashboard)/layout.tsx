// src/app/(dashboard)/layout.tsx
"use client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const isSidebarCollapsed = useAppSelector(
        (state) => state.global.isSidebarCollapsed
    );

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    return (
        <div className="flex min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-dark-bg dark:text-white">
            <Sidebar />
            <main
                className={`flex w-full flex-col bg-gray-50 dark:bg-dark-bg ${isSidebarCollapsed ? "" : "md:pl-64"
                    }`}
            >
                <Navbar />
                {children}
            </main>
        </div>
    );
}