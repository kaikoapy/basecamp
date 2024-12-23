"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ShimmerButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
}

type ShimmerAnimationVariables = {
  "--shimmer-button-x": string;
  scale?: number;
};

const ShimmerButton = ({ onClick, children }: ShimmerButtonProps) => {
  return (
    <motion.button
      className="inline-flex overflow-hidden rounded-lg bg-[linear-gradient(120deg,#FF98A4_calc(var(--shimmer-button-x)-25%),#f6f6f6_var(--shimmer-button-x),#FF98A4_calc(var(--shimmer-button-x)+25%))] [--shimmer-button-x:0%]"
      initial={
        {
          scale: 1,
          "--shimmer-button-x": "-100%",
        } as ShimmerAnimationVariables
      }
      animate={
        {
          "--shimmer-button-x": "200%",
        } as ShimmerAnimationVariables
      }
      transition={{
        stiffness: 500,
        damping: 20,
        type: "spring",
        "--shimmer-button-x": {
          duration: 3,
          repeat: Infinity,
          ease: [0.445, 0.05, 0.55, 0.95],
        },
      }}
      whileTap={{
        scale: 0.95,
      }}
      whileHover={{
        scale: 1.05,
      }}
      onClick={onClick}
    >
      <span className="m-[0.125rem] rounded-[calc(0.5rem-0.125rem)] bg-[#fb3b53] px-4 py-1 text-xs text-[#f6f6f6] backdrop-blur-sm flex items-center gap-2">
        {children || (
          <>
            <Check className="h-4 w-4" />
            Mark as read
          </>
        )}
      </span>
    </motion.button>
  );
};

export default ShimmerButton;
