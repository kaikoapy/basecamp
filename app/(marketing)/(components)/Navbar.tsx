import React from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
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
            <Button variant="ghost" className="text-sm font-medium">
              Sign In
            </Button>
            <Button className="text-sm font-medium">Start Free Trial</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
