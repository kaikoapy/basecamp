"use client";

import { FAQAccordion } from "@/components/ui/faq-accordion";
import { phevFAQItems } from "@/app/data/faqs/phev-faqs";

export function PHEVFAQDialog() {
  return <FAQAccordion items={phevFAQItems} defaultValue="1" />;
}
