import type { Metadata } from "next";
import { Inter, Geist_Mono, Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TooltipProvider>
      <ClerkProvider>
        <ConvexClientProvider>
          <html lang="en">
            <body
              className={`${inter.variable} ${poppins.variable} ${geistMono.variable} antialiased font-sans`}
            >
              {children}
              <Toaster />
            </body>
          </html>
        </ConvexClientProvider>
      </ClerkProvider>
    </TooltipProvider>
  );
}
