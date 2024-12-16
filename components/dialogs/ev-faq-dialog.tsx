"use client";

import { FAQAccordion } from "@/components/ui/faq-accordion";
import { evFAQItems } from "@/app/data/faqs/ev-faqs";

export function EVFAQDialog() {
  return <FAQAccordion items={evFAQItems} defaultValue="1" />;
}
