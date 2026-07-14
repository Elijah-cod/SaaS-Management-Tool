// src/app/layout.tsx
import type { Metadata } from "next";
import { auth } from "@/auth";
import "./globals.css";
import StoreProvider from "./redux";

export const metadata: Metadata = {
  applicationName: "SaaS Manager",
  title: {
    default: "SaaS Manager",
    template: "%s · SaaS Manager",
  },
  description: "A focused delivery workspace for startup teams.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
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
