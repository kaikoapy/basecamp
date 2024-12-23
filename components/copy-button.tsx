"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

interface CopyButtonProps extends VariantProps<typeof buttonVariants> {
  value: string;
  className?: string;
  iconSize?: number;
  tooltipText?: string;
}

export function CopyButton({
  value,
  className,
  iconSize = 12,
  tooltipText = "link",
  variant = "outline",
  size = "icon",
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn("h-6 w-6 disabled:opacity-100", className)}
          onClick={handleCopy}
          aria-label={copied ? "Copied" : `Copy ${tooltipText} to clipboard`}
          disabled={copied}
          {...props}
        >
          <div
            className={cn(
              "transition-all",
              copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
            )}
          >
            <Check
              className="stroke-emerald-500"
              size={iconSize}
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>
          <div
            className={cn(
              "absolute transition-all",
              copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
            )}
          >
            <Copy size={iconSize} strokeWidth={2} aria-hidden="true" />
          </div>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="px-2 py-1 text-xs">
        {copied ? "Copied!" : `Copy ${tooltipText} to clipboard`}
      </TooltipContent>
    </Tooltip>
  );
}
