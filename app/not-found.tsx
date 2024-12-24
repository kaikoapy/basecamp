"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

export default function NotFound() {
  return (
    <Suspense>
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <h2 className="text-3xl font-bold">404 - Not Found</h2>
        <p className="text-muted-foreground">
          Could not find the requested resource
        </p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </Suspense>
  );
}
