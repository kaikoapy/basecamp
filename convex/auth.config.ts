// Simple auth config without type annotation
interface TokenData {
  org?: {
    id?: string;
    role?: string;
  };
  sub?: string;
  email?: string;
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
    return {
      orgId: tokenData.org?.id,
      orgRole: tokenData.org?.role,
      userId: tokenData.sub,
      email: tokenData.email,
    };
  },
};

export default authConfig;
