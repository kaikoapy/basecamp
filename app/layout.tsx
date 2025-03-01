import type { Metadata } from "next";
import { Heebo, Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Providers } from "@/components/providers";
import { Suspense } from "react";

const heebo = Heebo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heebo",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Basecamp",
  description: "Basecamp",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${heebo.variable} ${inter.variable} antialiased font-sans`}
      >
        <TooltipProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <NuqsAdapter>
              <Providers>
                {children}
              </Providers>
            </NuqsAdapter>
            <Toaster richColors position="bottom-right" duration={6000} />
          </Suspense>
        </TooltipProvider>
      </body>
    </html>
  );
}
