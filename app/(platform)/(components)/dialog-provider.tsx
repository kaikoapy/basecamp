"use client";

import {
  BusinessApplicationsDialog,
  OutOfStateDialog,
  WireInstructionsDialog,
  ThirdPartyPayoffsDialog,
  EX90SheetDialog,
  OnboardingDialog,
  GasSavingsDialog,
} from "@/app/(platform)/dialogs";
import { DialogWrapper } from "@/app/(platform)/dialogs/dialog-wrapper";

export function DialogProvider() {
  return (
    <>
      <DialogWrapper name="business-applications">
        {BusinessApplicationsDialog}
      </DialogWrapper>
      <DialogWrapper name="out-of-state">
        {OutOfStateDialog}
      </DialogWrapper>
      <DialogWrapper name="wire-instructions">
        {WireInstructionsDialog}
      </DialogWrapper>
      <DialogWrapper name="third-party-payoffs">
        {ThirdPartyPayoffsDialog}
      </DialogWrapper>
      <DialogWrapper name="ex90-sheet">
        {EX90SheetDialog}
      </DialogWrapper>
      <DialogWrapper name="onboarding">
        {OnboardingDialog}
      </DialogWrapper>
      <DialogWrapper name="gas-savings">
        {GasSavingsDialog}
      </DialogWrapper>
    </>
  );
} 