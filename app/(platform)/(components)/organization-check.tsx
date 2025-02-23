"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { useEffect } from "react";

const DEFAULT_ORG_ID = process.env.NEXT_PUBLIC_VERCEL_ENV === "production" 
  ? "org_2tCUpNDKWSjk7287EmluGeDtC9R"  // prod org
  : "org_2qOItQ3RqlWD4snDfmLRD1CG5J5"; // dev org

export function OrganizationCheck() {
  const { setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  useEffect(() => {
    if (!setActive) return;

    // If no memberships or empty memberships, use default org
    if (!userMemberships.data?.length) {
      setActive({ organization: DEFAULT_ORG_ID });
      return;
    }

    // Get the current active organization ID
    const activeOrgId = userMemberships.data.find(mem => mem.organization.id === mem.organization.id)?.organization.id;

    // If no active organization, set the default org
    if (!activeOrgId) {
      setActive({ organization: DEFAULT_ORG_ID });
    }
  }, [userMemberships.data, setActive]);

  return null;
}
