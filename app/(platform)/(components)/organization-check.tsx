"use client";

import { useOrganizationList, useOrganization } from "@clerk/nextjs";
import { useEffect } from "react";

const DEFAULT_ORG_ID = process.env.NEXT_PUBLIC_VERCEL_ENV === "production" 
  ? "org_2tCUpNDKWSjk7287EmluGeDtC9R"  // prod org
  : "org_2qOItQ3RqlWD4snDfmLRD1CG5J5"; // dev org

export function OrganizationCheck() {
  const { setActive } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  const { isLoaded, organization } = useOrganization();

  useEffect(() => {
    if (!isLoaded || !setActive) return;

    // Always set the default organization
    console.log("OrganizationCheck: Setting organization", {
      current: organization?.id,
      default: DEFAULT_ORG_ID
    });
    
    setActive({ organization: DEFAULT_ORG_ID });
  }, [isLoaded, organization, setActive]);

  return null;
}
