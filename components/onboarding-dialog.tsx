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
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ArrowRight, Info } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function OnboardingDialog() {
  const [step, setStep] = useState(1);

  const stepContent = [
    {
      title: "Welcome to Dealer Hub",
      description:
        "Your centralized platform for accessing all essential dealer tools and resources in one place.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Quick Access",
      description:
        "Pin your most-used tools to the Quick Access section for faster navigation. Look for the pin icon when hovering over cards.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Tools & Resources",
      description:
        "Access external tools like A-Plan, Carfax, and DealerSocket, plus internal resources like Wire Instructions and FAQs.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Stay Updated",
      description:
        "Check the Announcements section for important updates and new features. Recent announcements will be marked as 'New'.",
      image: "/placeholder.svg?height=200&width=300",
    },
  ];

  const totalSteps = stepContent.length;

  const handleContinue = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) setStep(1);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Info className="h-5 w-5" />
          <span className="sr-only">Help</span>
        </Button>
      </DialogTrigger>
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
