"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { useEffect } from "react";

export function OrganizationCheck() {
  const { setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  useEffect(() => {
    // Only proceed if we have memberships data and setActive is available
    if (!userMemberships.data?.length || !setActive) return;

    // Get the current active organization ID
    const activeOrgId = userMemberships.data.find(mem => mem.organization.id === mem.organization.id)?.organization.id;

    // If no active organization, set the first one as active
    if (!activeOrgId && userMemberships.data[0]) {
      const firstOrg = userMemberships.data[0];
      setActive({ organization: firstOrg.organization.id });
    }
  }, [userMemberships.data, setActive]);

  return null;
}
