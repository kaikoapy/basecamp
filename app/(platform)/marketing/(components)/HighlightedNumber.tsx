"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface HighlightedNumberProps {
  number: string | number;
}

export const HighlightedNumber: React.FC<HighlightedNumberProps> = ({
  number,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x, y },
        ticks: 200,
      });
    }
  }, []);

  return (
    <motion.span
      ref={elementRef}
      className="relative inline-block font-bold text-pink-500 underline decoration-wavy underline-offset-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        scale: isHovered ? [1, 1.2, 1.1] : 1,
      }}
      transition={{
        duration: 0.3,
        times: [0, 0.2, 0.3],
        type: "spring",
        stiffness: 300,
        damping: 10,
      }}
    >
      {number}
      {isHovered && (
        <>
          <motion.span
            className="absolute inset-0"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0.3 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="absolute inset-0"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2, opacity: 0.6 }}
            transition={{ duration: 0.3 }}
          />
        </>
      )}
    </motion.span>
  );
};
