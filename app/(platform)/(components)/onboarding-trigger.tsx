"use client";

import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export function OnboardingTrigger() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("dialog", "onboarding");
    router.replace(`?${params.toString()}`);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-foreground"
      onClick={handleClick}
    >
      <Info className="h-5 w-5" />
      <span className="sr-only">Help</span>
    </Button>
  );
}
