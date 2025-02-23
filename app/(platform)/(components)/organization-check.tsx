"use client";

import { useOrganization } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function OrganizationCheck() {
  const { organization, isLoaded } = useOrganization();
  const pathname = usePathname();

  // Add error boundary for dealer info query
  useEffect(() => {
    if (!isLoaded) return;
    
    // Only proceed with dealer info query if we have an organization
    if (!organization?.id && pathname !== "/") {
      window.location.href = "/";
    }
  }, [isLoaded, organization?.id, pathname]);

  return null;
}
