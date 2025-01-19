"use client";

import { Check } from "lucide-react";

interface ShimmerButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
}

const ShimmerButton = ({ onClick, children }: ShimmerButtonProps) => {
  return (
    <button
      className="inline-flex overflow-hidden rounded-lg bg-zinc-800 hover:bg-zinc-900 transition-colors"
      onClick={onClick}
    >
      <span className="px-4 py-1.5 text-xs text-zinc-100 flex items-center gap-2">
        {children || (
          <>
            <Check className="h-4 w-4" />
            Mark as read
          </>
        )}
      </span>
    </button>
  );
};

export default ShimmerButton;
