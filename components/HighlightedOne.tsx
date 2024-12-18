"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export const HighlightedOne: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.4 },
      ticks: 200,
    });
  }, []);

  return (
    <motion.span
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
      one
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
