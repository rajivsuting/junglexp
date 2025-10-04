import type { Metadata } from "next";
import "../globals.css";

import { Montserrat } from "next/font/google";
import Link from "next/link";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Junglexp - Jim Corbett Resorts - Book Your Ideal Stay",
  description:
    "Experience the wilderness and luxury in India's oldest national park. Book your perfect stay at Jim Corbett Resorts with safaris, adventure activities, and premium accommodations.",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.className} font-sans antialiased`}>
        <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-white hover:text-gray-300 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              <h1 className="text-white text-lg font-semibold">Reels</h1>
            </div>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
