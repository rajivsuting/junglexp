import type { Metadata } from "next";
import './globals.css';

import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: "Jim Corbett Resorts - Book Your Ideal Stay",
  description:
    "Experience the wilderness and luxury in India's oldest national park. Book your perfect stay at Jim Corbett Resorts with safaris, adventure activities, and premium accommodations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
