"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Loading({
  message = "Loading...",
  className,
  size = "md",
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center h-full min-h-[200px]",
      className
    )}>
      <Loader2 className={cn("animate-spin text-primary mb-2", sizeClasses[size])} />
      <p className="text-muted-foreground font-medium">{message}</p>
    </div>
  );
} 