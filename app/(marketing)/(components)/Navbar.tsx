"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut, useClerk } from "@clerk/nextjs";

export default function Navbar() {
  const { signOut } = useClerk();

  return (
    <nav className="border-b">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <h1
            className="text-xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            <span className="text-primary font-bold">DealerHub</span>
          </h1>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-sm font-medium">
                  Sign In
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button className="text-sm font-medium">
                  Start Free Trial
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
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
