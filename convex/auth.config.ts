// Clerk auth configuration for Convex
interface TokenData {
  org?: {
    id?: string;
    role?: string;
    slug?: string;
    name?: string;
  };
  sub?: string;
  email?: string;
  name?: string;
}

const authConfig = {
  providers: [
    {
      domain:
        process.env.NEXT_PUBLIC_CLERK_DOMAIN ||
        "https://enabled-tetra-55.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
  getUserMetadata: async (tokenData: TokenData) => {
    // Log token data for debugging
    console.log("Clerk token data:", JSON.stringify({
      hasOrg: !!tokenData.org,
      orgId: tokenData.org?.id,
      orgRole: tokenData.org?.role,
      userId: tokenData.sub,
    }));
    
    // Return user metadata
    return {
      orgId: tokenData.org?.id || null,
      orgRole: tokenData.org?.role || null,
      orgName: tokenData.org?.name || null,
      orgSlug: tokenData.org?.slug || null,
      userId: tokenData.sub || null,
      email: tokenData.email || null,
      name: tokenData.name || null,
    };
  },
};

export default authConfig;
