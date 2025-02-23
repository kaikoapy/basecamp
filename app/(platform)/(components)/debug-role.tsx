"use client";

import { useOrganization } from "@clerk/nextjs";
import { useEffect } from "react";

export function DebugRole() {
  const { organization, isLoaded } = useOrganization();

  useEffect(() => {
    console.log("Debug Role Component:", {
      isLoaded,
      orgId: organization?.id,
      path: window.location.pathname
    });
  }, [isLoaded, organization]);

  return null;
}