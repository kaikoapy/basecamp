"use client";

import { useState } from "react";
import { Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const speedDialContacts = {
  management: [
    {
      name: "Serdar",
      title: "New Car Sales Manager",
      phone: "(555) 123-4567",
    },
    {
      name: "Marlon",
      title: "also a manager",
      phone: "(555) 123-4568",
    },
    {
      name: "Cesar",
      title: "Service Manager",
      phone: "(555) 123-4568",
    },
  ],
  porters: [
    { name: "Andres", phone: "(555) 123-4569" },
    { name: "Jaramio", phone: "(555) 123-4570" },
    { name: "Ramon", phone: "(555) 123-4571" },
  ],
  salespeople: [
    { name: "Ron", phone: "(555) 123-4572" },
    { name: "Juan", phone: "(555) 123-4573" },
    { name: "Moudy", phone: "(555) 123-4574" },
    { name: "Kai", phone: "(555) 123-4575" },
    { name: "Gio", phone: "(555) 123-4576" },
    { name: "Amr", phone: "(555) 123-4577" },
    { name: "Tito", phone: "(555) 123-4578" },
    { name: "Alex", phone: "(555) 123-4579" },
    { name: "Gabriel", phone: "(555) 123-4580" },
  ],
  productSpecialists: [
    { name: "Josh", phone: "(555) 123-4581" },
    { name: "Nick", phone: "(555) 123-4582" },
  ],
  external: {
    vfs: {
      name: "Volvo Financial Services",
      address:
        "Volvo Car Financial Services\nPO Box 91300\nMobile, AL 36691-1300",
      phone: "1-866-499-6793",
    },
    aPlan: {
      name: "A Plan",
      email: "Support@aplanbyvolvo.com",
    },
    costco: {
      name: "Costco Auto Program",
      phone: "1-800-755-2519",
    },
  },
};

export function SpeedDial() {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleCopy = async (
    text: string,
    type: "phone" | "email" | "address"
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "phone") {
        setCopiedPhone(text);
        setTimeout(() => setCopiedPhone(null), 1500);
      } else {
        setCopiedAddress(text);
        setTimeout(() => setCopiedAddress(null), 1500);
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const renderContactButton = (phone: string) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => handleCopy(phone, "phone")}
          className="flex items-center gap-1.5 text-sm text-foreground"
        >
          <span
            className={cn(
              "transition-colors",
              copiedPhone === phone && "text-emerald-500"
            )}
          >
            {phone}
          </span>
          <Check
            className={cn(
              "h-3.5 w-3.5 text-emerald-500 transition-all",
              copiedPhone === phone ? "opacity-100" : "opacity-0"
            )}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={5} className="flex items-center">
        <p>{copiedPhone === phone ? "Copied!" : "Click to copy"}</p>
        <TooltipArrow />
      </TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-3">
            <Users className="h-4 w-4 mr-2" />
            <span>Speed Dial</span>
          </Button>
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
                      <div className="text-sm font-semibold">
                        {manager.name} ({manager.title})
                      </div>
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
                      <span className="text-sm font-semibold">
                        {porter.name}
                      </span>
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
                      <span className="text-sm font-semibold">
                        {person.name}
                      </span>
                      {renderContactButton(person.phone)}
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
                      Volvo Financial Services
                    </h4>
                    <div className="space-y-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() =>
                              handleCopy(
                                speedDialContacts.external.vfs.address,
                                "address"
                              )
                            }
                            className="flex items-start gap-1.5 text-sm text-foreground w-full text-left"
                          >
                            <span
                              className={cn(
                                "whitespace-pre-line transition-colors",
                                copiedAddress ===
                                  speedDialContacts.external.vfs.address &&
                                  "text-emerald-500"
                              )}
                            >
                              {speedDialContacts.external.vfs.address}
                            </span>
                            <Check
                              className={cn(
                                "h-3.5 w-3.5 text-emerald-500 transition-all shrink-0 mt-1",
                                copiedAddress ===
                                  speedDialContacts.external.vfs.address
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          sideOffset={5}
                          className="flex items-center"
                        >
                          <p>
                            {copiedAddress ===
                            speedDialContacts.external.vfs.address
                              ? "Copied!"
                              : "Click to copy"}
                          </p>
                          <TooltipArrow />
                        </TooltipContent>
                      </Tooltip>
                      {renderContactButton(
                        speedDialContacts.external.vfs.phone
                      )}
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
                    {renderContactButton(
                      speedDialContacts.external.aPlan.email
                    )}
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
                      Costco Auto Program
                    </h4>
                    {renderContactButton(
                      speedDialContacts.external.costco.phone
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}
