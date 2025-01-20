"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function NavUser() {
  const pathname = usePathname();
  const isAuthPage =
    pathname.includes("/sign-in") || pathname.includes("/sign-up");

  if (isAuthPage) return null;

  return (
    <div className="flex items-center gap-4">
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: "h-8 w-8",
            userButtonTrigger: "focus:shadow-none",
          },
        }}
      />
      <Button asChild variant="outline" size="sm">
        <Link href="/sign-in">Sign In</Link>
      </Button>
    </div>
  );
}
