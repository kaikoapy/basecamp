"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface FullscreenImageProps {
  src: string;
  alt: string;
}

export function FullscreenImage({ src, alt }: FullscreenImageProps) {
  const openInNewTab = () => {
    window.open(src, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden group">
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={openInNewTab}
      >
        <ExternalLink className="h-4 w-4" />
      </Button>
      <Image src={src} alt={alt} fill className="object-contain" priority />
    </div>
  );
}
