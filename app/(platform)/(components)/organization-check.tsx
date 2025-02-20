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
    if (!userMemberships.data?.length || !setActive) return;

    // Get the first organization if available
    const firstOrg = userMemberships.data[0];
    if (firstOrg) {
      setActive({ organization: firstOrg.organization.id });
    }
  }, [userMemberships.data, setActive]);

  return null;
}
