import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ModalHost } from "../components/ModalHost";
import { StoreProvider } from "../lib/store";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Synapse — Team Collaboration",
  description:
    "A simple, fast team collaboration board. Track tasks, see progress, ship together.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 text-slate-900 flex">
        <a href="#main" className="skip-link">Skip to content</a>
        <StoreProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main id="main" className="p-6 lg:p-8 flex-1 overflow-x-auto" role="main">
              {children}
            </main>
          </div>
          <ModalHost />
        </StoreProvider>
      </body>
    </html>
  );
}
