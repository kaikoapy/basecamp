// Tremor Button [v0.2.0]

import { Slot } from "@radix-ui/react-slot"
import { RiLoader2Fill } from "@remixicon/react"
import React from "react"
import { tv, type VariantProps } from "tailwind-variants"

import { cn, focusRing } from "@/lib/utils"

const buttonVariants = tv({
  base: [
    // base
    "relative inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-center text-sm font-medium transition-all duration-200 ease-in-out",
    // disabled
    "disabled:pointer-events-none disabled:opacity-50",
    // focus
    focusRing,
  ],
  variants: {
    variant: {
      primary: [
        // border
        "border-2 border-transparent",
        // text color
        "text-white",
        // background color
        "bg-[#6a68f1]",
        // hover color
        "hover:bg-[#6a68f1]/90 hover:shadow-md hover:shadow-[#6a68f1]/20",
        // active state
        "active:scale-[0.98]",
      ],
      secondary: [
        // border
        "border-2 border-gray-200 dark:border-gray-800",
        // text color
        "text-gray-900 dark:text-gray-50",
        // background color
        "bg-white dark:bg-gray-950",
        // hover color
        "hover:bg-gray-50 hover:shadow-lg hover:shadow-gray-500/10 dark:hover:bg-gray-900/60",
        // active state
        "active:scale-[0.98]",
      ],
      light: [
        // base
        "shadow-none",
        // border
        "border-2 border-transparent",
        // text color
        "text-gray-900 dark:text-gray-50",
        // background color
        "bg-gray-100 dark:bg-gray-800",
        // hover color
        "hover:bg-gray-200 dark:hover:bg-gray-700",
        // active state
        "active:scale-[0.98]",
      ],
      ghost: [
        // base
        "shadow-none",
        // border
        "border-2 border-transparent",
        // text color
        "text-gray-900 dark:text-gray-50",
        // hover color
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        // active state
        "active:scale-[0.98]",
      ],
      destructive: [
        // text color
        "text-white",
        // border
        "border-2 border-transparent",
        // background color
        "bg-red-600",
        // hover color
        "hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/25",
        // active state
        "active:scale-[0.98]",
      ],
    },
  },
  defaultVariants: {
    variant: "primary",
  },
})

interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild,
      isLoading = false,
      loadingText,
      className,
      disabled,
      variant,
      children,
      ...props
    }: ButtonProps,
    forwardedRef,
  ) => {
    const Component = asChild ? Slot : "button"
    return (
      <Component
        ref={forwardedRef}
        className={cn(buttonVariants({ variant }), className)}
        disabled={disabled || isLoading}
        tremor-id="tremor-raw"
        {...props}
      >
        {isLoading ? (
          <span className="pointer-events-none flex shrink-0 items-center justify-center gap-1.5">
            <RiLoader2Fill
              className="size-4 shrink-0 animate-spin"
              aria-hidden="true"
            />
            <span className="sr-only">
              {loadingText ? loadingText : "Loading"}
            </span>
            {loadingText ? loadingText : children}
          </span>
        ) : (
          children
        )}
      </Component>
    )
  },
)

Button.displayName = "Button"

export { Button, buttonVariants, type ButtonProps }
