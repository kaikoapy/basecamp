"use client";

import { useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface OrganizationCheckProps {
  children: React.ReactNode;
}

export function OrganizationCheck({ children }: OrganizationCheckProps) {
  const { organization, isLoaded } = useOrganization();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !organization) {
      router.push("/select-org");
    }
  }, [isLoaded, organization, router]);

  if (!isLoaded || !organization) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
