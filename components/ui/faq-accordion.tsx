"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface FAQItem {
  id: string;
  icon: LucideIcon;
  title: string;
  sub?: string;
  content: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  defaultValue?: string;
  className?: string;
}

export function FAQAccordion({ items, defaultValue }: FAQAccordionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue={defaultValue}
    >
      {items.map((item) => (
        <AccordionItem value={item.id} key={item.id} className="py-2">
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger className="flex flex-1 items-center justify-between py-2 text-left text-[15px] font-semibold leading-6 transition-all [&[data-state=open]>svg]:rotate-180">
              <span className="flex items-center gap-3">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border"
                  aria-hidden="true"
                >
                  <item.icon size={16} strokeWidth={2} className="opacity-60" />
                </span>
                <span className="flex flex-col space-y-1">
                  <span>{item.title}</span>
                  {item.sub && (
                    <span className="text-sm font-normal text-muted-foreground">
                      {item.sub}
                    </span>
                  )}
                </span>
              </span>
              <ChevronDown
                size={16}
                strokeWidth={2}
                className="shrink-0 opacity-60 transition-transform duration-200"
                aria-hidden="true"
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionContent className="ms-3 pb-2 ps-10 text-muted-foreground">
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
