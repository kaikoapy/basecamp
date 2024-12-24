import type { Metadata } from "next";
import { Manrope, Geist_Mono, Poppins } from "next/font/google";
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

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-poppins",
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
        className={`${manrope.variable} ${poppins.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <TooltipProvider>
          <ClerkProvider>
            <ConvexClientProvider>
              <NuqsAdapter>
                <Providers>
                  {children}
                  <Suspense fallback={<div>Loading...</div>}>
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
                  </Suspense>
                </Providers>
              </NuqsAdapter>
              <Toaster />
            </ConvexClientProvider>
          </ClerkProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
