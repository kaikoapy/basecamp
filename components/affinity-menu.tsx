"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Info,
  Users2,
  Ambulance,
  Building2,
  LifeBuoy,
  FileText,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CopyButton } from "@/components/copy-button";
import { OpenLinkButton } from "@/components/open-link-button";
import { useToast } from "@/hooks/use-toast";

const SUPPORT_EMAIL = "support@aplanbyvolvo.com";

const SUPPORT_EMAIL_TEMPLATE = `Hi Support,

Can you please help me generate a pin for:

- Customer Name: 
- Address: 
- Email: 
- Phone: 

I've attached their proof of eligibility below.

Thank you for your help`;

interface AffinityOption {
  label: string;
  url: string;
}

const regularOptions: AffinityOption[] = [
  {
    label: "Medical Professional",
    url: "https://volvoaffinity.com/programs/medical-professional",
  },
  {
    label: "First Responder",
    url: "https://volvoaffinity.com/programs/first-responder",
  },
  {
    label: "Hospital Employee",
    url: "https://volvoaffinity.com/programs/hospital-employee",
  },
];

const associationOptions: AffinityOption[] = [
  {
    label: "American Bar Association",
    url: "https://volvoaffinity.com/programs/american-bar-association",
  },
  {
    label: "American Medical Association",
    url: "https://volvoaffinity.com/programs/american-medical-association",
  },
  {
    label: "American Dental Association",
    url: "https://volvoaffinity.com/programs/american-dental-association",
  },
];

export function AffinityMenu() {
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderOptionActions = (option: AffinityOption) => (
    <div className="ml-auto flex items-center gap-1">
      <CopyButton value={option.url} />
      <OpenLinkButton url={option.url} />
    </div>
  );

  // Don't render anything until mounted
  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 px-2">
          View Programs
          <ChevronDown
            className="-me-1 ms-1 opacity-60"
            size={14}
            strokeWidth={2}
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px]">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Users2
              size={16}
              strokeWidth={2}
              className="mr-2 opacity-60"
              aria-hidden="true"
            />
            <span>All Affinity Programs</span>
            {renderOptionActions({
              label: "All Programs",
              url: "https://volvoaffinity.com/programs",
            })}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center text-muted-foreground">
          <Ambulance
            size={16}
            strokeWidth={2}
            className="mr-2 opacity-60"
            aria-hidden="true"
          />
          Regular Programs
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {regularOptions.map((option) => (
            <DropdownMenuItem key={option.label}>
              <span>{option.label}</span>
              {renderOptionActions(option)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center text-muted-foreground">
          <Building2
            size={16}
            strokeWidth={2}
            className="mr-2 opacity-60"
            aria-hidden="true"
          />
          Associations
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 hover:bg-transparent p-0 ml-1"
              >
                <Info
                  size={14}
                  className="text-muted-foreground opacity-60 cursor-help"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-3 shadow-none" side="right">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">
                  Associations Program Eligibility
                </h4>
                <div className="space-y-3 text-[13px] leading-relaxed">
                  <div>
                    <p className="font-medium mb-2 text-foreground">
                      Basic Requirements:
                    </p>
                    <ul className="list-disc pl-4 space-y-1.5 text-muted-foreground">
                      <li>Members must have 90+ days of active membership</li>
                      <li>
                        Primary members only (affiliated members no longer
                        qualify)
                      </li>
                      <li>
                        Qualified members can still generate up to 3 sponsored
                        PINs for anyone per calendar year
                      </li>
                      <li>
                        Previous PINs not validated by 11/21 require new
                        generation
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2 text-foreground">
                      Eligible Members:
                    </p>
                    <ul className="list-disc pl-4 space-y-1.5 text-muted-foreground">
                      <li>Active lawyer members</li>
                      <li>Primary association members</li>
                      <li>Reactivated members (with valid membership)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2 text-foreground">
                      Not Eligible:
                    </p>
                    <ul className="list-disc pl-4 space-y-1.5 text-muted-foreground">
                      <li>Affiliated Professionals</li>
                      <li>Law Students</li>
                      <li>Association affiliates</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2 text-foreground">
                      Special Notes:
                    </p>
                    <ul className="list-disc pl-4 space-y-1.5 text-muted-foreground">
                      <li>
                        Reactivated association members can generate new PINs
                        upon membership restoration
                      </li>
                    </ul>
                  </div>
                  <p className="text-[12px] italic mt-3 text-muted-foreground/80">
                    Note: All PINs require validation and VIN assignment within
                    specified timeframes. Previous eligibility rules were
                    discontinued as of 11/21.
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {associationOptions.map((option) => (
            <DropdownMenuItem key={option.label}>
              <span>{option.label}</span>
              {renderOptionActions(option)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center text-muted-foreground">
          <LifeBuoy
            size={16}
            strokeWidth={2}
            className="mr-2 opacity-60"
            aria-hidden="true"
          />
          Support
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex items-center">
            <span>{SUPPORT_EMAIL}</span>
            <div className="ml-auto flex items-center gap-1">
              <CopyButton value={SUPPORT_EMAIL} tooltipText="email" />
              <HoverCard openDelay={0} closeDelay={0}>
                <HoverCardTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 hover:bg-transparent p-0"
                    onClick={() => {
                      navigator.clipboard.writeText(SUPPORT_EMAIL_TEMPLATE);
                      toast({
                        description: "Email template copied to clipboard",
                      });
                    }}
                  >
                    <FileText size={14} strokeWidth={2} aria-hidden="true" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent
                  className="w-[280px] p-3 shadow-none"
                  side="right"
                  align="start"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">Email Template</h4>
                      <CopyButton
                        value={SUPPORT_EMAIL_TEMPLATE}
                        tooltipText="template"
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <pre className="whitespace-pre-wrap font-mono bg-muted p-2 rounded-md">
                        {SUPPORT_EMAIL_TEMPLATE}
                      </pre>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
