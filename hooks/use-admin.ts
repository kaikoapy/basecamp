import { useOrganization } from "@clerk/nextjs";
import { createLogger } from "@/lib/logger";
import { useMemo } from "react";

const logger = createLogger("use-admin");

export function useAdmin() {
  const { membership, isLoaded } = useOrganization();

  // Use memoization to prevent unnecessary re-renders
  const adminState = useMemo(() => {
    // Debug logging
    logger.debug("Admin check", {
      isLoaded,
      role: membership?.role,
      orgId: membership?.organization?.id,
    });

    // Check for org:admin role
    const isAdmin = (isLoaded && membership?.role === "org:admin") || false;

    return {
      isAdmin,
      isLoaded,
    };
  }, [isLoaded, membership?.role, membership?.organization?.id]);

  return adminState;
}
