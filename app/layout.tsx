import type { Metadata } from "next";
import { Heebo, Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Providers } from "@/components/providers";
import { Suspense } from "react";
import { UpdateChecker } from "./components/update-checker";

// Use Vercel's commit SHA in production, fallback to timestamp for development
const BUILD_VERSION = process.env.VERCEL_GIT_COMMIT_SHA || Date.now().toString();

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
    <html lang="en" suppressHydrationWarning data-version={BUILD_VERSION}>
      <body
        className={`${heebo.variable} ${inter.variable} antialiased font-sans`}
      >
        <TooltipProvider>
          <Suspense fallback={
            <div className="fixed inset-0 flex items-center justify-center bg-background">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          }>
            <NuqsAdapter>
              <Providers>
                {children}
                <UpdateChecker />
              </Providers>
            </NuqsAdapter>
            <Toaster richColors position="bottom-right" duration={6000} />
          </Suspense>
        </TooltipProvider>
      </body>
    </html>
  );
}
