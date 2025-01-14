"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const { signOut } = useClerk();

  // Cleanup function to restore scroll when component unmounts
  useEffect(() => {
    return () => {
      // Reset body scroll on unmount
      document.body.style.removeProperty("overflow");
    };
  }, []);

  // Optional: Function to handle manual cleanup after dialog closes

  return (
    <nav className="border-b">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://4ztip6noaf.ufs.sh/f/WTe1MV8FTP1yshxp8S1UoIShzARj4Eer1uOngfm9tc72CvHq"
              alt="DealerHub Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <h1
              className="text-xl font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              <span className="text-primary font-bold">DealerHub</span>
            </h1>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-sm font-medium">
                  Sign In
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button className="text-sm font-medium">Start Now</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button variant="default" className="text-sm font-medium" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button
                variant="ghost"
                className="text-sm font-medium"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}
