"use client";

import { useState } from "react";
import { WireInstructionsDialog } from "@/app/(platform)/dialogs/wire-instructions-dialog";
import { OutOfStateDialog } from "@/app/(platform)/dialogs/out-of-state-dialog";
import { BusinessApplicationsDialog } from "@/app/(platform)/dialogs/business-applications-dialog";
import { ThirdPartyPayoffsDialog } from "@/app/(platform)/dialogs/third-party-payoffs-dialog";
import { OnboardingDialog } from "@/app/(platform)/dialogs/onboarding-dialog";
interface DynamicModalProps {
  component?: string;
  children: React.ReactNode;
}

const MODAL_COMPONENTS = {
  WireInstructionsDialog,
  OutOfStateFAQDialog: OutOfStateDialog,
  BusinessFAQDialog: BusinessApplicationsDialog,
  ThirdPartyPayoffsDialog,
  OnboardingDialog,
};

export function DynamicModal({ component, children }: DynamicModalProps) {
  const [open, setOpen] = useState(false);

  if (!component) {
    return <>{children}</>;
  }

  const ModalComponent =
    MODAL_COMPONENTS[component as keyof typeof MODAL_COMPONENTS];
  if (!ModalComponent) {
    return <>{children}</>;
  }

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      <ModalComponent open={open} onOpenChange={setOpen} />
    </>
  );
}
