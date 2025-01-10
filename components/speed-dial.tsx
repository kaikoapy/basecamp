"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { speedDialContacts } from "@/app/data/speed-dial";
import { CopyButton } from "@/components/copy-button";

export function SpeedDial() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const renderContactButton = (phone: string) => (
    <div className="flex items-center gap-1.5">
      <span className="text-sm">{phone}</span>
      <CopyButton
        value={phone}
        variant="ghost"
        className="hover:bg-transparent"
        iconSize={14}
        disableTooltip
      />
    </div>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="absolute inset-0 w-full h-full cursor-pointer">
          <span className="sr-only">Open speed dial</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="mb-4 text-lg font-semibold">Speed Dial</div>
        <Accordion type="single" collapsible className="w-full">
          {/* Management Section */}
          <AccordionItem value="management">
            <AccordionTrigger className="text-sm font-semibold">
              Management
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1">
                {speedDialContacts.management.map((manager) => (
                  <div
                    key={manager.name}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      hoveredItem === manager.name && "bg-muted"
                    )}
                    onMouseEnter={() => setHoveredItem(manager.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="text-sm font-semibold">{manager.name}</div>
                    {renderContactButton(manager.phone)}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Porters Section */}
          <AccordionItem value="porters">
            <AccordionTrigger className="text-sm font-semibold">
              Porters
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1">
                {speedDialContacts.porters.map((porter) => (
                  <div
                    key={porter.name}
                    className={cn(
                      "p-2 rounded-md transition-colors flex items-center justify-between",
                      hoveredItem === porter.name && "bg-muted"
                    )}
                    onMouseEnter={() => setHoveredItem(porter.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <span className="text-sm font-semibold">{porter.name}</span>
                    {renderContactButton(porter.phone)}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Sales Team Section */}
          <AccordionItem value="salesTeam">
            <AccordionTrigger className="text-sm font-semibold">
              Sales Team
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1">
                {speedDialContacts.salespeople.map((person) => (
                  <div
                    key={person.name}
                    className={cn(
                      "p-2 rounded-md transition-colors flex items-center justify-between",
                      hoveredItem === person.name && "bg-muted"
                    )}
                    onMouseEnter={() => setHoveredItem(person.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <span className="text-sm font-semibold">{person.name}</span>
                    {renderContactButton(person.phone)}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Delivery Specialists Section */}
          <AccordionItem value="deliverySpecialists">
            <AccordionTrigger className="text-sm font-semibold">
              Delivery Specialists
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1">
                {speedDialContacts.deliverySpecialists.map((specialist) => (
                  <div
                    key={specialist.name}
                    className={cn(
                      "p-2 rounded-md transition-colors flex items-center justify-between",
                      hoveredItem === specialist.name && "bg-muted"
                    )}
                    onMouseEnter={() => setHoveredItem(specialist.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <span className="text-sm font-semibold">
                      {specialist.name}
                    </span>
                    {renderContactButton(specialist.phone)}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* External Contacts Section */}
          <AccordionItem value="external">
            <AccordionTrigger className="text-sm font-semibold">
              External Contacts
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {/* VFS */}
                <div
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    hoveredItem === "vfs" && "bg-muted"
                  )}
                  onMouseEnter={() => setHoveredItem("vfs")}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <h4 className="text-sm font-semibold mb-2">
                    {speedDialContacts.external.vfs.name}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-1.5">
                      <span className="text-sm whitespace-pre-line">
                        {speedDialContacts.external.vfs.address}
                      </span>
                      <CopyButton
                        value={speedDialContacts.external.vfs.address!}
                        variant="ghost"
                        className="hover:bg-transparent"
                        iconSize={14}
                        disableTooltip
                      />
                    </div>
                    {speedDialContacts.external.vfs.phone &&
                      renderContactButton(speedDialContacts.external.vfs.phone)}
                  </div>
                </div>

                {/* A Plan */}
                <div
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    hoveredItem === "aplan" && "bg-muted"
                  )}
                  onMouseEnter={() => setHoveredItem("aplan")}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <h4 className="text-sm font-semibold">
                    A-Plan & Affinity Support
                  </h4>
                  {speedDialContacts.external.aPlan.email &&
                    renderContactButton(speedDialContacts.external.aPlan.email)}
                </div>

                {/* Costco */}
                <div
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    hoveredItem === "costco" && "bg-muted"
                  )}
                  onMouseEnter={() => setHoveredItem("costco")}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <h4 className="text-sm font-semibold">
                    {speedDialContacts.external.costco.name}
                  </h4>
                  {speedDialContacts.external.costco.phone &&
                    renderContactButton(
                      speedDialContacts.external.costco.phone
                    )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mt-2 pt-2">
          <Link
            href="/directory"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
          >
            View Complete Directory →
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
