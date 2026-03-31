// src/app/layout.tsx
import type { Metadata } from "next";
import { auth } from "@/auth";
import "./globals.css";
import StoreProvider from "./redux";

export const metadata: Metadata = {
  title: "Project Management",
  description: "Full-stack project management dashboard",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        <StoreProvider session={session}>{children}</StoreProvider>
      </body>
    </html>
  );
}
