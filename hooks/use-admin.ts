import { useOrganization } from "@clerk/nextjs";
import { createLogger } from "@/lib/logger";

const logger = createLogger("use-admin");

export function useAdmin() {
  const { membership, isLoaded } = useOrganization();

  // Debug logging
  logger.debug("Admin check", {
    isLoaded,
    role: membership?.role,
    orgId: membership?.organization.id,
  });

  // Check for org:admin role
  const isAdmin = (isLoaded && membership?.role === "org:admin") || false;

  return {
    isAdmin,
    isLoaded,
  };
}
