"use client";

import { useOrganization } from "@clerk/nextjs";

interface OrganizationCheckProps {
  children: React.ReactNode;
}

export function OrganizationCheck({ children }: OrganizationCheckProps) {
  const { isLoaded } = useOrganization();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
