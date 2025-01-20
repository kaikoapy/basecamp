"use client";

import { useOrganization } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export function useAnnouncementsPermission() {
  const { organization, membership, isLoaded } = useOrganization();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    console.log("=== Announcements Permission Check ===");
    console.log({
      isLoaded,
      organizationId: organization?.id,
      organizationName: organization?.name,
      membershipRole: membership?.role,
      hasOrg: !!organization,
      hasMembership: !!membership,
    });

    const isAdmin = membership?.role === "org:admin";
    setHasPermission(isAdmin ?? false);
  }, [isLoaded, organization, membership]);

  // Don't return a value until Clerk is loaded
  if (!isLoaded) return false;

  return hasPermission;
}
