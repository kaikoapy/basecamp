"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { OnboardingDialog } from "../../../(dialogs)/onboarding-dialog";

export function OnboardingDialogWrapper() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const hasCompletedOnboarding = useQuery(api.users.getOnboardingStatus);
  const markComplete = useMutation(api.users.markOnboardingComplete);

  useEffect(() => {
    if (hasCompletedOnboarding === false) {
      setShowOnboarding(true);
    }
  }, [hasCompletedOnboarding]);

  const handleOpenChange = (open: boolean) => {
    setShowOnboarding(open);
    if (!open && hasCompletedOnboarding === false) {
      markComplete();
    }
  };

  return (
    <OnboardingDialog 
      open={showOnboarding} 
      onOpenChange={handleOpenChange}
    />
  );
} 