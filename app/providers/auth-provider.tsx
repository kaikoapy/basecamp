"use client";

import { 
  ClerkProvider, 
  useAuth, 
  useUser, 
  useOrganization,
  useOrganizationList
} from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createLogger } from "@/lib/logger";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const logger = createLogger("auth-provider");
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Define the auth context type
interface AuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  userId: string | null;
  orgId: string | null;
  orgRole: string | null;
  isAdmin: boolean;
  hasOrganization: boolean;
  hasAvailableOrganizations: boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  isLoaded: false,
  isSignedIn: false,
  userId: null,
  orgId: null,
  orgRole: null,
  isAdmin: false,
  hasOrganization: false,
  hasAvailableOrganizations: false,
});

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          logoPlacement: "inside",
          logoImageUrl: "/logo.png",
          showOptionalFields: true,
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "iconButton",
        },
        variables: {
          colorPrimary: "#0F172A",
        },
        elements: {
          formButtonPrimary:
            "bg-primary text-primary-foreground hover:bg-primary/90",
          card: "shadow-none",
          formFieldInput:
            "rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        },
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <AuthStateProvider>
          {children}
        </AuthStateProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

// Internal provider that manages auth state
function AuthStateProvider({ children }: { children: ReactNode }) {
  const { isLoaded: isUserLoaded, user } = useUser();
  const { isLoaded: isOrgLoaded, organization, membership } = useOrganization();
  const { isLoaded: isOrgListLoaded, userMemberships } = useOrganizationList();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Derived state
  const isLoaded = isUserLoaded && isOrgLoaded && isOrgListLoaded;
  const userId = user?.id || null;
  const orgId = organization?.id || null;
  const orgRole = membership?.role || null;
  const isAdmin = orgRole === "org:admin";
  const hasOrganization = !!orgId;
  
  // Check if user has any available organizations
  const hasAvailableOrganizations = 
    isOrgListLoaded && 
    userMemberships && 
    ((userMemberships.count && userMemberships.count > 0) || 
     (userMemberships.data && userMemberships.data.length > 0));

  // Log auth state for debugging
  useEffect(() => {
    if (isLoaded) {
      logger.debug("Auth state", {
        isSignedIn,
        userId,
        orgId,
        orgRole,
        isAdmin,
        hasOrganization,
        hasAvailableOrganizations,
        availableOrgsCount: userMemberships?.count,
        availableOrgsData: userMemberships?.data?.length,
        pathname
      });
    }
  }, [isLoaded, isSignedIn, userId, orgId, orgRole, isAdmin, hasOrganization, hasAvailableOrganizations, userMemberships, pathname]);

  // Handle organization redirects - but only after a short delay to allow Clerk to initialize
  useEffect(() => {
    if (!isLoaded || isRedirecting) return;

    // Skip redirection for certain paths
    const isPublicPath = 
      pathname === "/" || 
      pathname.startsWith("/sign-") || 
      pathname.startsWith("/organizations");
    
    if (isPublicPath) return;

    // If user is signed in but has no organization
    if (isSignedIn && !hasOrganization) {
      // Add a longer delay to ensure Clerk has fully loaded organization data
      const timer = setTimeout(() => {
        // Double-check that we still need to redirect
        if (!hasOrganization) {
          setIsRedirecting(true);
          
          // If user has available organizations, redirect to organization selector
          if (hasAvailableOrganizations) {
            logger.debug("Redirecting to organizations page - has orgs but none selected", { 
              pathname,
              hasAvailableOrganizations,
              availableOrgsCount: userMemberships?.count,
              availableOrgsData: userMemberships?.data?.length
            });
            router.push("/organizations");
          } else {
            // If user has no organizations at all, redirect to home
            logger.debug("Redirecting to home - no organizations available", { pathname });
            router.push("/");
          }
        }
      }, 1000); // Longer delay to ensure Clerk has fully loaded
      
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn, hasOrganization, hasAvailableOrganizations, pathname, router, isRedirecting, userMemberships]);

  // Provide the auth context
  return (
    <AuthContext.Provider
      value={{
        isLoaded,
        isSignedIn: !!isSignedIn,
        userId,
        orgId,
        orgRole,
        isAdmin,
        hasOrganization,
        hasAvailableOrganizations,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAppAuth() {
  return useContext(AuthContext);
} 