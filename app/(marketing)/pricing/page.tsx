"use client"

import { Badge } from "../_components/Badge"
import { PricingSection } from "../_components/pricing-section"
import { Faqs } from "../_components/Faqs"
import Balancer from "react-wrap-balancer"

export default function Pricing() {
  return (
    <div className="px-3">
      <section
        aria-labelledby="pricing-title"
        className="animate-slide-up-fade text-center"
        style={{
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        <div className="flex justify-center">
          <Badge>Pricing</Badge>
        </div>
        <h1 className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300">
          <Balancer>
          Simple Pricing
          </Balancer>
        </h1>
        <p className="mt-6 mx-auto max-w-2xl text-lg text-gray-700 dark:text-gray-400">
        No Hidden Fees, No Long-Term Contracts, and Continuous Improvements with Included Support!
        </p>
      </section>

      <PricingSection />

      <div className="max-w-6xl mx-auto">
        <Faqs />
      </div>
    </div>
  )
}