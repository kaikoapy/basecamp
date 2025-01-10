"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OnboardingDialog({
  open,
  onOpenChange,
}: OnboardingDialogProps) {
  const [step, setStep] = useState(1);

  const stepContent = [
    {
      title: "Welcome to Dealer Hub",
      description:
        "Here's your go-to spot for all the tools and resources you need, all in one place.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Quick Access",
      description:
        "Pin your favorite tools here for quicker access. Just hover over a card and look for the pin icon.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Tools & Resources",
      description:
        "Get to external tools like A-Plan, Carfax, and DealerSocket, plus our internal stuff like wire instructions and FAQs.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Stay Updated",
      description:
        "Keep an eye on the Announcements for the latest news or new features. You'll see 'New' on the recent ones.",
      image: "/placeholder.svg?height=200&width=300",
    },
  ];

  const totalSteps = stepContent.length;

  const handleContinue = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setStep(1);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 p-0">
        <div className="p-2">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <Image
              src={stepContent[step - 1].image}
              alt={stepContent[step - 1].title}
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="space-y-6 px-6 pb-6 pt-2">
          <DialogHeader>
            <DialogTitle>{stepContent[step - 1].title}</DialogTitle>
            <DialogDescription className="pt-2">
              {stepContent[step - 1].description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex justify-center space-x-1.5 max-sm:order-1">
              {[...Array(totalSteps)].map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full bg-primary",
                    index + 1 === step ? "bg-primary" : "opacity-20"
                  )}
                />
              ))}
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Skip
                </Button>
              </DialogClose>
              {step < totalSteps ? (
                <Button
                  className="group"
                  type="button"
                  onClick={handleContinue}
                >
                  Next
                  <ArrowRight
                    className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </Button>
              ) : (
                <DialogClose asChild>
                  <Button type="button">Got it</Button>
                </DialogClose>
              )}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
