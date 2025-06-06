// app/layout.tsx

import type { ReactNode } from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

// تعريف الخط Inter مرة واحدة فقط
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "نظام إدارة عقود الاستثمار",
  description: "نظام متكامل لإدارة عقود الاستثمار والدفعات",
  generator: "v0.dev",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
