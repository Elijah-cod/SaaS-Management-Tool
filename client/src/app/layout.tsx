// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "./redux";

export const metadata: Metadata = {
  title: "Project Management",
  description: "Full-stack project management dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}