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
      title: "Welcome to Basecamp",
      description:
        "Here's your go-to spot for all the tools and resources you need, all in one place.",
      video: "https://4ztip6noaf.ufs.sh/f/WTe1MV8FTP1yzHt38s0hjmS4fOLN1qgvdriDbFCVGYJwQlXH",
    },
    {
      title: "Everyday links",
      description:
        "Bookmark your favorite tools here for quick access. Click to copy sharable links to your clipboard or open links in new tabs directly.",
      video: "https://4ztip6noaf.ufs.sh/f/WTe1MV8FTP1yZqQFn9LHhXtkF3K8PfNJaT9UxMReBgIqyCEj",
    },
    {
      title: "Useful Navbar",
      description:
        "Search bar for quick staff and resource lookup, General dealer info, speed dial for quick access to staff all with click to copy, and a quick link to the sales schedule.",
      video: "https://4ztip6noaf.ufs.sh/f/WTe1MV8FTP1yD8BhEWznNxGEbKORAcTIhe2u30QPvsHiaoCJ",
    },

    {
      title: "Tools & Resources",
      description:
        "Easily access documents to print, view additional resources, tools, product knowledge, and more to make your job easier.",
      video: "https://4ztip6noaf.ufs.sh/f/WTe1MV8FTP1yLAeYRdU0NFxPEbliwHGXe5B84MSn3v7gULpk",
    },
    {
      title: "Stay Updated",
      description:
        "Keep an eye on the announcements section for the latest dealership news and updates. Mark them read so your manager knows you've seen them.",
      video: "https://4ztip6noaf.ufs.sh/f/WTe1MV8FTP1yrYtjCuTKQvElgKmYat2NTfp9hIdML7Rx8JWP",
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
            <video
              src={stepContent[step - 1].video}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
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
