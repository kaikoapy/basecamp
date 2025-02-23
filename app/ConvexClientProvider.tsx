"use client";

import { ClerkProvider, useAuth, useOrganization } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Create a wrapper component that waits for org data
function ConvexProviderWrapper({ children }: { children: ReactNode }) {
  const { isLoaded: isOrgLoaded } = useOrganization();
  
  if (!isOrgLoaded) {
    return <div>Loading organization...</div>;
  }

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexProviderWrapper>
        {children}
      </ConvexProviderWrapper>
    </ClerkProvider>
  );
}
