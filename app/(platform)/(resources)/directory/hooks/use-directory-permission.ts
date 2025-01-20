"use client";

import { useOrganization } from "@clerk/nextjs";
import { useState, useEffect, useMemo } from "react";

// Simple debounce for logs
let lastLog = 0;
const LOG_INTERVAL = 1000; // 1 second

export function useDirectoryPermission() {
  const { organization, membership, isLoaded } = useOrganization();
  const [hasPermission, setHasPermission] = useState(false);

  // Memoize the permission check
  const isAdmin = useMemo(() => {
    if (!isLoaded) return false;
    return membership?.role === "org:admin";
  }, [isLoaded, membership?.role]);

  useEffect(() => {
    if (!isLoaded) return;

    // Only log in development and throttle logs
    if (process.env.NODE_ENV === "development") {
      const now = Date.now();
      if (now - lastLog > LOG_INTERVAL) {
        console.log("=== Directory Permission Check ===");
        console.log({
          isLoaded,
          organizationId: organization?.id,
          organizationName: organization?.name,
          membershipRole: membership?.role,
          hasOrg: !!organization,
          hasMembership: !!membership,
        });
        lastLog = now;
      }
    }

    setHasPermission(isAdmin);
  }, [isLoaded, organization, membership, isAdmin]);

  // Don't return a value until Clerk is loaded
  if (!isLoaded) return false;

  return hasPermission;
}
