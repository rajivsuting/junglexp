import type { Metadata } from "next";
import '../globals.css';

import { Montserrat } from 'next/font/google';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: "Jim Corbett Resorts - Book Your Ideal Stay",
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
        <Header transparent />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
