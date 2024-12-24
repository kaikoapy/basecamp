"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  defaultValue?: string;
  className?: string;
  transition?: {
    type: string;
    bounce: number;
    duration: number;
  };
  enableHover?: boolean;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "data-id"?: string;
}

export function AnimatedBackground({
  children,
  className,
}: AnimatedBackgroundProps) {
  const [active, setActive] = React.useState<string | null>(null);
  const [bounds, setBounds] = React.useState<DOMRect | null>(null);
  const [buttonBounds, setButtonBounds] = React.useState<{
    [key: string]: DOMRect;
  }>({});
  const containerRef = React.useRef<HTMLDivElement>(null);

  const updateBounds = React.useCallback(() => {
    if (containerRef.current) {
      setBounds(containerRef.current.getBoundingClientRect());

      const buttons = containerRef.current.querySelectorAll("[data-id]");
      const newButtonBounds: { [key: string]: DOMRect } = {};

      buttons.forEach((button) => {
        const id = button.getAttribute("data-id");
        if (id) {
          newButtonBounds[id] = button.getBoundingClientRect();
        }
      });

      setButtonBounds(newButtonBounds);
    }
  }, []);

  React.useEffect(() => {
    updateBounds();
    const observer = new ResizeObserver(updateBounds);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    window.addEventListener("resize", updateBounds);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateBounds);
    };
  }, [updateBounds]);

  if (!bounds || Object.keys(buttonBounds).length === 0) {
    return (
      <div ref={containerRef} className={cn("relative", className)}>
        {children}
      </div>
    );
  }

  const buttonBound = active ? buttonBounds[active] : null;

  return (
    <div
      ref={containerRef}
      className={cn("relative flex items-center gap-1", className)}
      onMouseLeave={() => setActive(null)}
    >
      {active && (
        <motion.div
          className="absolute inset-0 bg-zinc-200/50 dark:bg-zinc-700/50 rounded-md -z-10"
          layoutId="hover"
          initial={false}
          animate={{
            width: buttonBound ? buttonBound.width : bounds.width,
            height: buttonBound ? buttonBound.height : bounds.height,
            x: buttonBound ? buttonBound.x - bounds.x : 0,
            y: buttonBound ? buttonBound.y - bounds.y : 0,
          }}
          transition={{
            type: "spring",
            bounce: 0.15,
            duration: 0.4,
          }}
        />
      )}
      {React.Children.map(children, (child) => {
        if (!React.isValidElement<ButtonProps>(child)) return child;

        return React.cloneElement(child, {
          onMouseEnter: () => {
            if (child.props["data-id"]) {
              setActive(child.props["data-id"]);
              updateBounds();
            }
          },
          onClick: () => {
            if (child.props["data-id"]) {
              setActive(child.props["data-id"]);
              updateBounds();
            }
          },
        });
      })}
    </div>
  );
}
