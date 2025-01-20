"use client";

import * as React from "react";
import { useDialog } from "@/components/providers/dialog-provider";

interface DialogWrapperProps {
  name: string;
  children: React.ComponentType<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }>;
}

export function DialogWrapper({
  name,
  children: Component,
}: DialogWrapperProps) {
  const { dialog, hideDialog } = useDialog();
  const open = dialog === name;

  return (
    <Component open={open} onOpenChange={(isOpen) => !isOpen && hideDialog()} />
  );
}
