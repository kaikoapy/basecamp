"use client";

import { DialogProvider } from "./dialog-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <DialogProvider>{children}</DialogProvider>;
}
