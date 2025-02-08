"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";

export function StartNowButton() {
  return (
    <div className="flex flex-col items-center gap-4">
      <SignInButton mode="modal">
        <Button size="lg" className="gap-2">
          Start Now <ArrowRight className="h-4 w-4" />
        </Button>
      </SignInButton>
      <span className="text-sm text-gray-500">
        Your Sales Arsenal, Organized
      </span>
    </div>
  );
} 