// File: /Users/kaiandpicha/basecamp/components/copy-button.tsx

"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";
import { motion, useAnimation } from "framer-motion";

const defaultTransition = {
  type: "spring",
  stiffness: 500,
  damping: 30,
};

interface CopyButtonProps extends VariantProps<typeof buttonVariants> {
  value: string;
  className?: string;
  iconSize?: number;
  tooltipText?: string;
  disableTooltip?: boolean;
  onClick?: () => void;
  showText?: boolean;
}


export function CopyButton({
  value,
  className,
  iconSize = 12,
  tooltipText = "link",
  variant = "outline",
  size = "icon",
  disableTooltip = false,
  onClick,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const controls = useAnimation();

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      if (onClick) {
        onClick();
      }
    } catch {
      // Show appropriate user feedback
    }
  };

  const AnimatedCopyIcon = () => (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.rect
          width="14"
          height="14"
          x="8"
          y="8"
          rx="2"
          ry="2"
          variants={{
            normal: { translateY: 0, translateX: 0 },
            animate: { translateY: -2, translateX: -2 },
          }}
          animate={controls}
          transition={defaultTransition}
        />
        <motion.path
          d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
          variants={{
            normal: { x: 0, y: 0 },
            animate: { x: 2, y: 2 },
          }}
          transition={defaultTransition}
          animate={controls}
        />
      </motion.svg>
    </div>
  );

  const button = (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "relative h-6 w-6 p-1 hover:bg-transparent hover:opacity-70",
        className
      )}
      onClick={handleCopy}
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
      aria-label={copied ? "Copied" : `Copy ${tooltipText} to clipboard`}
      disabled={copied}
      {...props}
    >
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all",
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
          "flex items-center justify-center transition-all",
          copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <AnimatedCopyIcon />
      </div>
    </Button>
  );

  if (disableTooltip) return button;

  return (
    <Tooltip delayDuration={0} defaultOpen={false}>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent className="px-2 py-1 text-xs">
        {copied ? "Copied!" : `Copy ${tooltipText} to clipboard`}
      </TooltipContent>
    </Tooltip>
  );
}

export function CopyButtonWithText({
  value,
  className,
  tooltipText = "link",
  variant = "outline",
  disableTooltip = false,
  onClick,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const controls = useAnimation();

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      if (onClick) {
        onClick();
      }
    } catch {
      // Show appropriate user feedback
    }
  };

  const AnimatedCopyIcon = () => (
    <div className="relative flex items-cente justify-center gap-1.5 py-1">
      <span className="font-medium text-xs">
        {copied ? "Copied!" : "Copy link"}
      </span>
      {copied ? (
        <Check className="w-3 h-3 stroke-emerald-500" />
      ) : (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width={12}
          height={12}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.rect
            width="14"
            height="14"
            x="8"
            y="8"
            rx="2"
            ry="2"
            variants={{
              normal: { translateY: 0, translateX: 0 },
              animate: { translateY: -2, translateX: -2 },
            }}
            animate={controls}
            transition={defaultTransition}
          />
          <motion.path
            d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
            variants={{
              normal: { x: 0, y: 0 },
              animate: { x: 2, y: 2 },
            }}
            transition={defaultTransition}
            animate={controls}
          />
        </motion.svg>
      )}
    </div>
  );

  const button = (
    <Button
      variant={variant}
      size="sm"
      className={cn(
        "relative hover:bg-transparent hover:opacity-70 h-7",
        copied && "text-emerald-500",
        className
      )}
      onClick={handleCopy}
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
      aria-label={copied ? "Copied" : `Copy ${tooltipText} to clipboard`}
      disabled={copied}
      {...props}
    >
      <AnimatedCopyIcon />
    </Button>
  );

  if (disableTooltip) return button;

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent className="px-2 py-1 text-xs">
        {copied ? "Copied!" : `Copy ${tooltipText} to clipboard`}
      </TooltipContent>
    </Tooltip>
  );
}

export function CopyButtonInline({
  value,
  className,
  tooltipText = "text",
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Show appropriate user feedback
    }
  };

  return (
    <div className="flex items-center">
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <span
            onClick={handleCopy}
            className={cn(
              "cursor-pointer hover:text-purple-500 transition-colors",
              className
            )}
          >
            {value}
            {copied && (
              <span className="ml-2 text-xs text-emerald-500">Copied!</span>
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent className="text-xs">
          {copied ? "Copied!" : `Click to copy ${tooltipText}`}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
