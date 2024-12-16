"use client";

import * as React from "react";
import { SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OpenLinkButtonProps {
  url: string;
  className?: string;
  iconSize?: number;
}

export function OpenLinkButton({ url }: OpenLinkButtonProps) {
  const handleOpenLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={handleOpenLink}
            aria-label="Open in new tab"
          >
            <SquareArrowOutUpRight
              size={14}
              strokeWidth={2}
              aria-hidden="true"
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">
          Open in new tab
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
