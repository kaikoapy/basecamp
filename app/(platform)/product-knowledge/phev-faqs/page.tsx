"use client";

import React, { useState } from "react";
import {
  phevFAQItems,
  phevMisconceptions,
    // phevStory,
} from "@/app/(platform)/product-knowledge/(lib)/phev-faqs";
import { FAQAccordion } from "@/app/(platform)/product-knowledge/(components)/faq-accordion";
import {
  Battery,
  Gauge,
  Timer,
  Wrench,
  Shield,
  DollarSign,
  Coins,
  RefreshCw,
  Cloud,
  Plug,
  Image as ImageIcon,
  BookOpen,
  AlertTriangle,
  // BookText,
} from "lucide-react";
import { MisconceptionsSection } from "@/app/(platform)/product-knowledge/(components)/Misconceptions-section";
// import { StorySection } from "@/app/(platform)/product-knowledge/(components)/StorySection";
import { TransitionPanel } from "@/components/ui/transition-panel";

// Map of icon names to components that we'll use on the client side
const iconMap = {
  Battery,
  Gauge,
  Timer,
  Wrench,
  Shield,
  DollarSign,
  Coins,
  RefreshCw,
  Cloud,
  Plug,
  Image: ImageIcon,
};

const TABS = [
  {
    title: "FAQs",
    icon: BookOpen,
  },
  {
    title: "Misconceptions",
    icon: AlertTriangle,
  },
  // {
  //   title: "Story",
  //   icon: BookText,
  // },
];

export default function PHEVFAQPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Transform the items to use icon names instead of components
  const items = phevFAQItems.map((item) => ({
    ...item,
    iconName: item.iconName,
  }));

  return (
    <main className="mx-auto max-w-4xl py-8 px-4">
      <h1 className="mb-6 text-2xl font-bold">Volvo PHEV Resources</h1>
      <p className="mb-8 text-muted-foreground">
        Everything you need to know about Volvo Plug-in Hybrid Electric Vehicles
        (PHEVs), from charging basics to common misconceptions and the PHEV
        ownership journey.
      </p>

      <div className="mb-8 flex space-x-3">
        {TABS.map((tab, index) => {
          const Icon = tab.icon;
          return (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeIndex === index
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.title}
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <TransitionPanel
          activeIndex={activeIndex}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          variants={{
            enter: { opacity: 0, y: -50, filter: "blur(4px)" },
            center: { opacity: 1, y: 0, filter: "blur(0px)" },
            exit: { opacity: 0, y: 50, filter: "blur(4px)" },
          }}
          className="p-6"
        >
          {[
            // FAQs Section
            <div key="faqs" className="space-y-6">
              <h2 className="text-xl font-semibold">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Common questions and answers about Volvo&apos;s Plug-in Hybrid
                Electric Vehicles (PHEVs), covering everything from charging and
                range to maintenance and special features.
              </p>
              <FAQAccordion items={items} iconMap={iconMap} defaultValue="1" />
            </div>,

            // Misconceptions Section
            <div key="misconceptions" className="space-y-6">
              <h2 className="text-xl font-semibold">Common Misconceptions</h2>
              <p className="text-muted-foreground">
                Let&apos;s separate fact from fiction about plug-in hybrid
                vehicles and address common concerns about PHEV ownership.
              </p>
              <MisconceptionsSection
                misconceptions={phevMisconceptions}
                title="Common Misconceptions"
                description="Let's separate fact from fiction about plug-in hybrid vehicles and address common concerns about PHEV ownership."
              />
            </div>,

            // Story Section
            // <div key="story" className="space-y-6">
            //   <h2 className="text-xl font-semibold">The PHEV Journey</h2>
            //   <p className="text-muted-foreground">
            //     Follow along with this simple story that explains PHEV ownership
            //     in a friendly, approachable way.
            //   </p>
            //   <StorySection story={phevStory} />
            // </div>,
          ]}
        </TransitionPanel>
      </div>
    </main>
  );
}
