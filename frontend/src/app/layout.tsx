import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CyePro AI Notification Engine",
  description: "Advanced prioritization and routing engine for notifications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground flex h-screen overflow-hidden`} suppressHydrationWarning>
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,oklch(0.7_0.18_160_/_0.05),transparent_50%)] pointer-events-none"></div>
          {children}
        </main>
      </body>
    </html>
  );
}
