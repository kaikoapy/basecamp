"use client";

import { DialogWrapper } from "@/app/(platform)/(dialogs)/dialog-wrapper";
import * as Dialogs from "@/app/(platform)/(dialogs)";

export function DialogProvider() {
  return (
    <>
      <DialogWrapper name="business-applications">
        {Dialogs.BusinessApplicationsDialog}
      </DialogWrapper>
      <DialogWrapper name="out-of-state">
        {Dialogs.OutOfStateDialog}
      </DialogWrapper>
      <DialogWrapper name="wire-instructions">
        {Dialogs.WireInstructionsDialog}
      </DialogWrapper>
      <DialogWrapper name="third-party-payoffs">
        {Dialogs.ThirdPartyPayoffsDialog}
      </DialogWrapper>
      <DialogWrapper name="ex90-sheet">
        {Dialogs.EX90SheetDialog}
      </DialogWrapper>
      <DialogWrapper name="onboarding">
        {Dialogs.OnboardingDialog}
      </DialogWrapper>
      <DialogWrapper name="gas-savings">
        {Dialogs.GasSavingsDialog}
      </DialogWrapper>
    </>
  );
} 