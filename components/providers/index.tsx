"use client";

import { DialogProvider } from "./dialog-provider";
import { AuthProvider } from "@/app/providers/auth-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <DialogProvider>
        {children}
      </DialogProvider>
    </AuthProvider>
  );
}
