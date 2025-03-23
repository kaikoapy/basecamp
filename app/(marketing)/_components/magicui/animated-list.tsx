"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useMemo,
  useState,
} from "react";

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 }
  };

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  );
}

export interface AnimatedListProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  delay?: number;
}

export const AnimatedList = React.memo(
  ({ children, className, delay = 1000, ...props }: AnimatedListProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [items, setItems] = useState<React.ReactNode[]>([]);
    const childrenArray = useMemo(
      () => React.Children.toArray(children),
      [children],
    );

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % childrenArray.length);
      }, delay);

      return () => clearInterval(interval);
    }, [delay, childrenArray.length]);

    useEffect(() => {
      const newItem = React.cloneElement(
        childrenArray[currentIndex] as React.ReactElement,
        { key: `${Date.now()}-${currentIndex}-${Math.random()}` }
      );
      setItems(prev => [newItem, ...prev].slice(0, 3));
    }, [currentIndex, childrenArray]);

    return (
      <div
        className={cn(`flex flex-col items-center gap-4`, className)}
        {...props}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item) => (
            <AnimatedListItem key={(item as React.ReactElement).key}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    );
  },
);

AnimatedList.displayName = "AnimatedList";
