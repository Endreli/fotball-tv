import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "KampSentralen — Finn kampen din pa TV",
  description: "Se hvilken TV-kanal fotballkampen sendes pa. Premier League, Eliteserien, Champions League og mer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <body className={`${geistSans.variable} font-sans antialiased bg-[#0a0f1a] text-white min-h-screen`}>
        <header className="border-b border-white/10 bg-[#0a0f1a]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center font-bold text-sm text-[#0a0f1a]">
                KS
              </div>
              <span className="font-bold text-lg tracking-tight">KampSentralen</span>
            </a>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
