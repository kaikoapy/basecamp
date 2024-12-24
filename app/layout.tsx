import type { Metadata } from "next";
import { Heebo, Geist_Mono, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Providers } from "@/components/providers";
import {
  BusinessApplicationsDialog,
  OutOfStateDialog,
  WireInstructionsDialog,
  ThirdPartyPayoffsDialog,
  EX90SheetDialog,
} from "@/app/(platform)/dialogs";
import { DialogWrapper } from "@/app/(platform)/dialogs/dialog-wrapper";
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

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DealerHub",
  description: "VNM - Dealer Hub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${heebo.variable} ${inter.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <TooltipProvider>
          <ClerkProvider>
            <ConvexClientProvider>
              <Suspense fallback={<div>Loading...</div>}>
                <NuqsAdapter>
                  <Providers>
                    {children}

                    <DialogWrapper name="business-applications">
                      {BusinessApplicationsDialog}
                    </DialogWrapper>
                    <DialogWrapper name="out-of-state">
                      {OutOfStateDialog}
                    </DialogWrapper>
                    <DialogWrapper name="wire-instructions">
                      {WireInstructionsDialog}
                    </DialogWrapper>
                    <DialogWrapper name="third-party-payoffs">
                      {ThirdPartyPayoffsDialog}
                    </DialogWrapper>
                    <DialogWrapper name="ex90-sheet">
                      {EX90SheetDialog}
                    </DialogWrapper>
                  </Providers>
                </NuqsAdapter>
                <Toaster />
              </Suspense>
            </ConvexClientProvider>
          </ClerkProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
