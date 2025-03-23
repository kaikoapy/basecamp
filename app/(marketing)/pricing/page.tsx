"use client"
import { Badge } from "../_components/Badge"
import { Button } from "../_components/Button"
import { Label } from "../_components/label"
import { Switch } from "../_components/Switch"
import { ArrowAnimated } from "../_components/ArrowAnimated"
import { Faqs } from "../_components/Faqs"
import Testimonial from "../_components/Testimonial"
import Balancer from "react-wrap-balancer"
import {
  RiCheckLine,
  RiCloudLine,
 
  RiUserLine,
} from "@remixicon/react"
import Link from "next/link"
import React from "react"

type FixedPrice = string

interface VariablePrice {
  monthly: string
  annually: string
}

interface Plan {
  name: string
  price: FixedPrice | VariablePrice
  description: string
  capacity: string[]
  features: string[]
  isStarter: boolean
  isRecommended: boolean
  buttonText: string
  buttonLink: string
}

const plans: Plan[] = [
  {
    name: "Starter",
    price: { monthly: "$47", annually: "$39" },
    description:
      "For individual salespeople who need organization and quick access to essential tools.",
    capacity: ["1 user", "Personal dashboard"],
    features: [
      "Basic links organization",
      "Carfax integration",
      "Volvo product specs",
      "Email support",
    ],
    isStarter: true,
    isRecommended: false,
    buttonText: "Get started",
    buttonLink: "#",
  },
  {
    name: "Pro",
    price: { monthly: "$197", annually: "$159" },
    description: "For small to mid-sized dealerships ready to streamline their sales process.",
    capacity: ["Up to 15 users, 2 managers", "Team workspace"],
    features: [
      "Team dashboard",
      "Shared bookmarks",
      "Inventory integration",
      "Schedules & calendar sync",
      "Priority support",
    ],
    isStarter: false,
    isRecommended: false,
    buttonText: "Contact sales",
    buttonLink: "#",
  },
  {
    name: "Pro Max",
    price: { monthly: "$297", annually: "$239" },
    description:
      "For larger dealerships needing comprehensive tools and advanced features.",
    capacity: ["Unlimited users & managers", "Multiple locations"],
    features: [
      "Everything in Pro",
      "Multi-location management",
      "Advanced analytics",
      "Customer pipeline tracking",
      "Custom integrations",
      "Dedicated support",
      "Uplist integration",
    ],
    isStarter: false,
    isRecommended: true,
    buttonText: "Contact sales",
    buttonLink: "#",
  },
]

interface Feature {
  name: string
  plans: Record<string, boolean | string>
  tooltip?: string
}

interface Section {
  name: string
  features: Feature[]
}

const sections: Section[] = [
  {
    name: "Core Features",
    features: [
      {
        name: "Centralized bookmarks",
        tooltip:
          "All your essential links in one organized dashboard - Carfax, inventory, Volvo portals, and more.",
        plans: { "Starter": true, "Pro": true, "Pro Max": true },
      },
      {
        name: "User accounts",
        tooltip:
          "Number of team members who can access the platform with personalized dashboards.",
        plans: { "Starter": "1 user", "Pro": "Up to 15", "Pro Max": "Unlimited" },
      },
      {
        name: "Volvo resources",
        tooltip:
          "Access to product specifications, pricing guides, and Volvo-specific documentation.",
        plans: {
          "Starter": "Basic",
          "Pro": "Advanced",
          "Pro Max": "Complete",
        },
      },
      {
        name: "Team sharing",
        tooltip:
          "Share important links, resources, and information across your sales team.",
        plans: {
          "Starter": false,
          "Pro": true,
          "Pro Max": true,
        },
      },
    ],
  },
  {
    name: "Integrations",
    features: [
      {
        name: "Carfax integration",
        tooltip:
          "Quick access to vehicle history reports directly in your dashboard.",
        plans: { "Starter": "Basic", "Pro": "Advanced", "Pro Max": "Premium" },
      },
      {
        name: "Inventory system",
        tooltip:
          "Connect to your dealership's inventory management system.",
        plans: { "Starter": false, "Pro": true, "Pro Max": true },
      },
      {
        name: "Calendar & scheduling",
        tooltip:
          "Sync with your existing calendar and manage appointments.",
        plans: { "Starter": false, "Pro": "Standard", "Pro Max": "Advanced" },
      },
    ],
  },
  {
    name: "Analytics",
    features: [
      {
        name: "Usage reports",
        tooltip:
          "Track how your team is using Basecamp and which resources they access most.",
        plans: { "Starter": false, "Pro": "Basic", "Pro Max": "Advanced" },
      },
      {
        name: "Sales performance",
        tooltip:
          "Visualize team performance and identify top performers.",
        plans: { "Starter": false, "Pro": false, "Pro Max": true },
      },
      {
        name: "Custom dashboards",
        tooltip:
          "Build personalized analytics views for managers and team leaders.",
        plans: { "Starter": false, "Pro": false, "Pro Max": true },
      },
    ],
  },
  {
    name: "Support",
    features: [
      {
        name: "Customer support",
        plans: {
          "Starter": "Email only",
          "Pro": "Email & chat",
          "Pro Max": "Dedicated agent",
        },
      },
      {
        name: "Response time",
        plans: { "Starter": "48 hours", "Pro": "24 hours", "Pro Max": "Priority" },
      },
      {
        name: "Training",
        plans: { "Starter": false, "Pro": "Group session", "Pro Max": "Personalized" },
      },
    ],
  },
]

const isVariablePrice = (
  price: FixedPrice | VariablePrice,
): price is VariablePrice => {
  return (price as VariablePrice).monthly !== undefined
}

export default function Pricing() {
  const [billingFrequency, setBillingFrequency] = React.useState<
    "monthly" | "annually"
  >("monthly")
  return (
    <div className="px-3">
      <section
        aria-labelledby="pricing-title"
        className="animate-slide-up-fade"
        style={{
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        <Badge>Pricing</Badge>
        <h1 className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300">
          <Balancer>
            Simple pricing for focused sales teams
          </Balancer>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-700 dark:text-gray-400">
          Stop wasting time juggling bookmarks and tabs. Our plans help your Volvo sales team focus on what matters—selling cars, not searching for tools. No hidden fees, just straightforward value.
        </p>
      </section>
      <section
        id="pricing-overview"
        className="animate-slide-up-fade mt-20"
        aria-labelledby="pricing-overview"
        style={{
          animationDuration: "600ms",
          animationDelay: "200ms",
          animationFillMode: "backwards",
        }}
      >
        <div className="flex items-center justify-center gap-2">
          <Label
            htmlFor="switch"
            className="text-base font-medium sm:text-sm dark:text-gray-400"
          >
            Monthly
          </Label>
          <Switch
            id="switch"
            checked={billingFrequency === "annually"}
            onCheckedChange={() =>
              setBillingFrequency(
                billingFrequency === "monthly" ? "annually" : "monthly",
              )
            }
          />
          <Label
            htmlFor="switch"
            className="text-base font-medium sm:text-sm dark:text-gray-400"
          >
            Yearly (-20%)
          </Label>
        </div>
        <div className="grid grid-cols-1 gap-x-14 gap-y-8 lg:grid-cols-3">
          {plans.map((plan, planIdx) => (
            <div key={planIdx} className="mt-6">
              {plan.isRecommended ? (
                <div className="flex h-4 items-center">
                  <div className="relative w-full">
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="w-full border-t border-indigo-600 dark:border-indigo-400" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-3 text-xs font-medium text-indigo-600 dark:bg-gray-950 dark:text-indigo-400">
                        Most popular
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-4 items-center">
                  <div className="h-px w-full bg-gray-200 dark:bg-gray-800" />
                </div>
              )}
              <div className="mx-auto max-w-md">
                <h2 className="mt-6 text-sm font-semibold text-gray-900 dark:text-gray-50">
                  {plan.name}
                </h2>
                <div className="mt-3 flex items-center gap-x-3">
                  <span className="text-5xl font-semibold tabular-nums text-gray-900 dark:text-gray-50">
                    {isVariablePrice(plan.price)
                      ? billingFrequency === "monthly"
                        ? plan.price.monthly
                        : plan.price.annually
                      : plan.price}
                  </span>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    per user <br /> per month
                  </div>
                </div>
                <div className="mt-6 flex flex-col justify-between">
                  <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                    {plan.description}
                  </p>
                  <div className="mt-6">
                    {plan.isStarter ? (
                      <Button variant="secondary" asChild className="group">
                        <Link href={plan.buttonLink}>
                          {plan.buttonText}
                          <ArrowAnimated />
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild className="group">
                        <Link href={plan.buttonLink}>
                          {plan.buttonText}
                          <ArrowAnimated />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
                <ul
                  role="list"
                  className="mt-8 text-sm text-gray-700 dark:text-gray-400"
                >
                  {plan.capacity.map((feature, index) => (
                    <li
                      key={feature}
                      className="flex items-center gap-x-3 py-1.5"
                    >
                      {index === 0 && (
                        <RiUserLine
                          className="size-4 shrink-0 text-gray-500"
                          aria-hidden="true"
                        />
                      )}
                      {index === 1 && (
                        <RiCloudLine
                          className="size-4 shrink-0 text-gray-500"
                          aria-hidden="true"
                        />
                      )}
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <ul
                  role="list"
                  className="mt-4 text-sm text-gray-700 dark:text-gray-400"
                >
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-x-3 py-1.5"
                    >
                      <RiCheckLine
                        className="size-4 shrink-0 text-indigo-600 dark:text-indigo-400"
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="testimonial"
        className="mx-auto mt-20 max-w-xl sm:mt-32 lg:max-w-6xl"
        aria-labelledby="testimonial"
      >
        <Testimonial />
      </section>

      {/* plan details (xs-lg)*/}
      <section
        id="pricing-details"
        className="mt-20 sm:mt-36"
        aria-labelledby="pricing-details"
      >
        <div className="mx-auto space-y-8 sm:max-w-md lg:hidden">
          {plans.map((plan) => (
            <div key={plan.name}>
              <div className="rounded-xl bg-gray-400/5 p-6 ring-1 ring-inset ring-gray-200 dark:ring-gray-800">
                <h2
                  id={plan.name}
                  className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-50"
                >
                  {plan.name}
                </h2>
                <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                  {isVariablePrice(plan.price)
                    ? `${
                        billingFrequency === "monthly"
                          ? plan.price.monthly
                          : plan.price.annually
                      } / per user`
                    : plan.price}
                </p>
              </div>
              <ul
                role="list"
                className="mt-10 space-y-10 text-sm leading-6 text-gray-900 dark:text-gray-50"
              >
                {sections.map((section) => (
                  <li key={section.name}>
                    <h3 className="font-semibold">{section.name}</h3>
                    <ul
                      role="list"
                      className="mt-2 divide-y divide-gray-200 dark:divide-gray-800"
                    >
                      {section.features.map((feature) =>
                        feature.plans[plan.name] ? (
                          <li
                            key={feature.name}
                            className="flex gap-x-3 py-2.5"
                          >
                            <RiCheckLine
                              className="size-5 flex-none text-indigo-600 dark:text-indigo-400"
                              aria-hidden="true"
                            />
                            <span>
                              {feature.name}{" "}
                              {typeof feature.plans[plan.name] === "string" ? (
                                <span className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                                  ({feature.plans[plan.name]})
                                </span>
                              ) : null}
                            </span>
                          </li>
                        ) : null,
                      )}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <Faqs />
    </div>
  )
}