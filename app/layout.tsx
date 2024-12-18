import type { Metadata } from "next";
import { Inter, Geist_Mono, Poppins } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
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
              <div className="absolute top-4 right-4 z-50">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
              {children}
              <Toaster />
            </body>
          </html>
        </ConvexClientProvider>
      </ClerkProvider>
    </TooltipProvider>
  );
}
