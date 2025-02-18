"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

interface TabNavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
  children?: React.ReactNode
}

type TabNavigationLinkProps = {
  disabled?: boolean
  asChild?: boolean
  active?: boolean
} & (
  | { value: string; active?: undefined }
  | { value?: string; active: boolean }
) & Omit<React.HTMLAttributes<HTMLButtonElement>, 'value'>

const TabNavigationContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
}>({})

const TabNavigation = React.forwardRef<HTMLDivElement, TabNavigationProps>(
  ({ className, value, onValueChange, defaultValue, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const currentValue = value ?? internalValue

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        setInternalValue(newValue)
        onValueChange?.(newValue)
      },
      [onValueChange]
    )

    return (
      <TabNavigationContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
        <div
          ref={ref}
          className={cn(
            "flex h-auto items-center justify-start gap-2 whitespace-nowrap rounded-none border-b border-border bg-transparent px-0 py-1 text-foreground",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TabNavigationContext.Provider>
    )
  }
)
TabNavigation.displayName = "TabNavigation"

const TabNavigationLink = React.forwardRef<HTMLButtonElement, TabNavigationLinkProps>(
  ({ className, value, disabled, asChild = false, active, children, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = React.useContext(TabNavigationContext)
    const isSelected = active ?? (selectedValue === value)
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isSelected}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={() => value && !disabled && onValueChange?.(value)}
        className={cn(
          // Base styles
          "relative flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-all",
          // Interactive states
          "hover:bg-accent hover:text-foreground hover:rounded-md",
          // Active indicator
          "after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:transition-all",
          // Selected state
          isSelected && "text-foreground after:bg-primary",
          !isSelected && "text-foreground/60 after:bg-transparent",
          // Disabled state
          disabled && "pointer-events-none text-foreground/30",
          // Focus state
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
TabNavigationLink.displayName = "TabNavigationLink"

export { TabNavigation, TabNavigationLink }
