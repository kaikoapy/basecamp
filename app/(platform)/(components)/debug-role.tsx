"use client";

import { useOrganization } from "@clerk/nextjs";
import { createLogger } from "@/lib/logger";

const logger = createLogger("debug-role");

export function DebugRole() {
  const { organization, isLoaded } = useOrganization();

  logger.debug("Role state", {
    isLoaded,
    orgId: organization?.id,
    role: organization?.publicMetadata?.role
  });

  return null;
}