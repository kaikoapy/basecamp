"use client"

import { PricingCard } from "./pricing-card"

export function PricingSection() {
  const annualFeatures = [
    "All your tools and resources accessible in one place",
    "Sales Schedule Builder — Templates built with React, Next.js, and TailwindCSS",
    "Store Directory — Use the templates for commercial projects. Re-selling of code is NOT allowed.",
    "Lifetime updates - We will continue to update the templates for the life of the product",
  ]

  const lifetimeFeatures = [
    ...annualFeatures,
    "SuperFast Inventory — Get access to our super fast internal inventory tool",
    "BestUp Uplist — Get access to the best uplist software and app",
  ]

  const teamFeatures = [
    "Exclusive onboarding and consultation to simplify dealership operations, find waste in tech spend, and more.",
  ]

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16">
      {/* Top cards with overlapping effect */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-full flex flex-col lg:flex-row justify-center items-center lg:items-start">
          {/* This wrapper creates the staggered effect */}
          <div className="relative w-full max-w-[1200px] flex flex-col lg:flex-row justify-center">
            {/* Annual License Card */}
            <div className="lg:mr-[-60px] lg:mt-12 mb-8 lg:mb-0 w-full">
              <PricingCard
                title="Basecamp Standard"
                price="$47"
                originalPrice="$97"
                billingPeriod="billed monthly"
                description="Full access to all resources, directory, Schedule Builder, product training, announcments and more."
                features={annualFeatures}
                buttonText="Request Access"
                buttonVariant="outline"
                className="lg:max-w-[560px] ml-auto"
              />
            </div>

            {/* Lifetime License Card */}
            <div className="relative w-full">
              <PricingCard
                title="Basecamp Pro +"
                price="$297"
                originalPrice="$397"
                billingPeriod="billed monthly"
                description="Full access to all resources, directory, Schedule Builder, product training, announcments and more."
                features={lifetimeFeatures}
                isRecommended
                buttonText="Request Access"
                className="lg:max-w-[480px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Team License Card */}
      <div className="flex justify-center">
        <div className="w-full max-w-[900px] relative right-[30px]">
          <PricingCard
            title="Basecamp Elite"
            price="$697"
            originalPrice="$997"
            billingPeriod="billed monthly"
            description="Beautifully crafted React + Tailwind CSS + Framer Motion templates for your team's next web project."
            features={teamFeatures}
            buttonText="Apply"
            className="!max-w-none bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
          />
        </div>
      </div>
    </div>
  )
} 