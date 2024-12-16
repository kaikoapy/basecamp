"use client";

import { FAQAccordion } from "@/components/ui/faq-accordion";
import { outOfStateFAQItems } from "@/app/data/faqs/out-of-state-faqs";

export function OutOfStateFAQDialog() {
  return <FAQAccordion items={outOfStateFAQItems} defaultValue="1" />;
}
