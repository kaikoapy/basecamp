"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { Bell, Link2 } from "lucide-react";

const faqItems = [
  {
    id: "1",
    icon: Link2,
    title: "Connected accounts",
    sub: "Manage your linked social and work accounts",
    content:
      "Connect your accounts from Google, GitHub, or Microsoft to enable single sign-on and streamline your workflow...",
  },
  {
    id: "2",
    icon: Bell,
    title: "Notifications",
    sub: "Customize your notification preferences",
    content: "Choose which updates you want to receive...",
  },
  // ... other FAQ items
];

export function FAQDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open FAQ</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Frequently Asked Questions</DialogTitle>
        </DialogHeader>
        <FAQAccordion items={faqItems} defaultValue="1" />
      </DialogContent>
    </Dialog>
  );
}
