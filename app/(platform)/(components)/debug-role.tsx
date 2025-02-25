"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { createLogger } from "@/lib/logger";
import { useEffect } from "react";

const logger = createLogger("debug-role");

export function DebugRole() {
  const { organization, isLoaded: orgLoaded, membership } = useOrganization();
  const { user, isLoaded: userLoaded } = useUser();

  useEffect(() => {
    // Only log when both user and organization data are loaded
    if (!orgLoaded || !userLoaded) return;

    logger.debug("Role state", {
      orgLoaded,
      userLoaded,
      orgId: organization?.id,
      orgName: organization?.name,
      role: membership?.role,
      userId: user?.id,
      userEmail: user?.primaryEmailAddress?.emailAddress
    });
  }, [orgLoaded, userLoaded, organization, user, membership]);

  return null;
}