"use client";

import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow,
} from "@/components/ui/tooltip";

interface ComingSoonTooltipProps {
  children: React.ReactNode;
  title: string;
  description: string;
  image?: string;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  align?: "start" | "center" | "end";
}

export function ComingSoonTooltip({
  children,
  title,
  description,
  image,
  side = "left",
  sideOffset = 10,
  align = "start",
}: ComingSoonTooltipProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          sideOffset={sideOffset}
          align={align}
          className="w-[300px] p-3"
        >
          <TooltipArrow />
          <div className="space-y-3">
            {image && (
              <Image
                src={image}
                width={300}
                height={169}
                alt="Feature preview"
                className="rounded-lg"
              />
            )}
            <div className="space-y-1">
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
