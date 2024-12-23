import { useOrganization } from "@clerk/nextjs";

export function useAdmin() {
  const { membership, isLoaded } = useOrganization();

  // Debug logging
  console.log({
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
