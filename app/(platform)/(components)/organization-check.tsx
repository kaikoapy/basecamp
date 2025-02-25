"use client";

import { useOrganization } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { createLogger } from "@/lib/logger";

const logger = createLogger("organization-check");

export function OrganizationCheck() {
  const { organization, isLoaded } = useOrganization();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  // Add error boundary for dealer info query
  useEffect(() => {
    if (!isLoaded) return;
    
    // Log organization state for debugging
    logger.debug("Organization check", {
      isLoaded,
      orgId: organization?.id,
      pathname,
      hasRedirected: hasRedirected.current
    });
    
    // Only proceed with dealer info query if we have an organization
    // Add a small delay and prevent multiple redirects
    if (!organization?.id && pathname !== "/" && !hasRedirected.current) {
      hasRedirected.current = true;
      
      // Add a small delay to prevent flashing
      const redirectTimer = setTimeout(() => {
        logger.debug("Redirecting to home due to missing organization", {
          pathname
        });
        window.location.href = "/";
      }, 500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isLoaded, organization?.id, pathname]);

  return null;
}
