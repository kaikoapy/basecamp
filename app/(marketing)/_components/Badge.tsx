import React from "react"

type BadgeProps = React.ComponentPropsWithoutRef<"span">

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, className, ...props }: BadgeProps, forwardedRef) => {
    return (
      <span
        ref={forwardedRef}
        className={`z-10 block w-fit rounded-lg border border-[#6a68f1]/20 bg-[#6a68f1]/10 px-3 py-1.5 font-semibold uppercase leading-4 tracking-tighter sm:text-sm dark:border-[#5553d4]/30 dark:bg-[#5553d4]/20 ${className || ""}`}
        {...props}
      >
        <span className="bg-gradient-to-b from-[#6a68f1] to-[#5553d4] bg-clip-text text-transparent dark:from-[#6a68f1] dark:to-[#5553d4]">
          {children}
        </span>
      </span>
    )
  },
)

Badge.displayName = "Badge"

export { Badge, type BadgeProps }
