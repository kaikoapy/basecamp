"use client";

import { useOrganization, useAuth } from "@clerk/nextjs";

export function DebugRole() {
  const { membership, isLoaded: orgLoaded } = useOrganization();
  const { has, isLoaded: authLoaded } = useAuth();

  if (process.env.NODE_ENV === "development") {
    console.log("Debug Role Info:", {
      orgLoaded,
      authLoaded,
      membershipRole: membership?.role,
      orgId: membership?.organization?.id,
      hasAdminRole: has?.({ role: "org:admin" }),
    });
  }

  return null;
}