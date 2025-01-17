"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Button } from "@/components/ui/button";
import { ChevronDown, LucideIcon, Brain } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: string;
  iconName: string;
  title: string;
  sub?: string;
  content: string;
  simpleContent: string;
  imageUrl?: string; // Regular explanation image
  simpleImageUrl?: string; // Simple explanation image
}

interface FAQAccordionProps {
  items: FAQItem[];
  iconMap: Record<string, LucideIcon>;
  defaultValue?: string;
  className?: string;
}

export function FAQAccordion({
  items,
  iconMap,
  defaultValue,
}: FAQAccordionProps) {
  const [simpleMode, setSimpleMode] = useState<Record<string, boolean>>({});

  const toggleSimpleMode = (id: string) => {
    setSimpleMode((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue={defaultValue}
    >
      {items.map((item) => {
        const Icon = iconMap[item.iconName];
        const isSimple = simpleMode[item.id];

        return (
          <AccordionItem value={item.id} key={item.id} className="py-2">
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="flex flex-1 items-center justify-between py-2 text-left text-[15px] font-semibold leading-6 transition-all [&[data-state=open]>svg]:rotate-180">
                <span className="flex items-center gap-3">
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border"
                    aria-hidden="true"
                  >
                    {Icon && (
                      <Icon size={16} strokeWidth={2} className="opacity-60" />
                    )}
                  </span>
                  <span className="flex flex-col space-y-1">
                    <span>{item.title}</span>
                    {item.sub && (
                      <span className="text-md font-normal text-grey-800">
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
            <AccordionContent className="ms-3 pb-2 ps-10 text-md text-grey-800">
              <div className="space-y-4">
                {item.simpleContent && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mb-4"
                    onClick={() => toggleSimpleMode(item.id)}
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    {isSimple
                      ? "Show Normal Explanation"
                      : "Explain Like I'm 5"}
                  </Button>
                )}

                <p
                  className={cn(
                    "whitespace-pre-line",
                    isSimple &&
                      "font-['Comic_Sans_MS',_cursive] text-[1.05em] leading-relaxed"
                  )}
                >
                  {isSimple ? item.simpleContent : item.content}
                </p>

                {/* Updated image handling */}
                {((isSimple && item.simpleImageUrl) ||
                  (!isSimple && item.imageUrl)) && (
                  <div className="mt-2">
                    <Image
                      src={isSimple ? item.simpleImageUrl! : item.imageUrl!}
                      alt={item.title}
                      className="max-w-full h-auto rounded"
                      width={500}
                      height={500}
                    />
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
