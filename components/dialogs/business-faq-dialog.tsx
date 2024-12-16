"use client";

import { FAQAccordion } from "@/components/ui/faq-accordion";
import { businessFAQItems } from "@/app/data/faqs/business-faqs";

export function BusinessFAQDialog() {
  return <FAQAccordion items={businessFAQItems} defaultValue="1" />;
}
