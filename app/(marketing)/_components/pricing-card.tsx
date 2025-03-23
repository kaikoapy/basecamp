"use client"

import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PricingCardProps {
  title: string
  price: string
  originalPrice?: string
  billingPeriod: string
  description: string
  features: string[]
  isRecommended?: boolean
  buttonText: string
  buttonVariant?: "default" | "outline"
  className?: string
}

export function PricingCard({
  title,
  price,
  originalPrice,
  billingPeriod,
  description,
  features,
  isRecommended,
  buttonText,
  buttonVariant = "default",
  className,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md rounded-3xl border border-gray-200 p-8 relative",
        isRecommended 
          ? "bg-white z-20 shadow-[0_20px_50px_rgba(0,0,0,0.2)]" 
          : "bg-gray-50 z-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)]",
        className
      )}
    >
      {isRecommended && (
        <div className="absolute right-8 top-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Recommended
          </span>
        </div>
      )}

      <div className={cn("space-y-5", !isRecommended && "pr-16")}>
        <h3 className="text-xl font-medium text-gray-900">{title}</h3>

        <div>
          <div className="flex items-baseline">
            <span className="text-5xl font-bold tracking-tight text-gray-900">{price}</span>
            {originalPrice && (
              <span className="ml-2 text-2xl text-gray-400 line-through">{originalPrice}</span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">{billingPeriod}</p>
        </div>

        <div className="pt-1">
          <p className="text-gray-600">{description}</p>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">What&apos;s included:</h4>

          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex">
                <div
                  className={cn(    
                    "h-5 w-5 shrink-0",
                    isRecommended
                      ? "rounded-full bg-green-100 flex items-center justify-center"
                      : ""
                  )}
                >
                  <Check
                    className={cn(
                      "h-5 w-5",
                      isRecommended ? "h-3.5 w-3.5 text-green-600" : "text-gray-900"
                    )}
                  />
                </div>
                <span className="ml-3 text-gray-600">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <Button
          className={cn(
            "w-full group h-12 rounded-xl mt-6",
            buttonVariant === "outline"
              ? "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
              : "bg-black hover:bg-black/90 text-white"
          )}
          variant={buttonVariant}
        >
          <span className="mx-auto flex items-center">
            {buttonText}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Button>
      </div>
    </div>
  )
} 