import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes
const publicRoutes = createRouteMatcher([
  "/", 
  "/sign-in(.*)", 
  "/sign-up(.*)",
  "/organizations(.*)",
  "/marketing(.*)",
  "/public(.*)",
  "/imprint(.*)",
  "/privacy(.*)",
  "/terms(.*)",
  "/dpa(.*)",
  "/pricing(.*)",
  "/faq(.*)",
]);

// Define webhook routes that should bypass auth
const webhookRoutes = createRouteMatcher(["/api/webhook/postmark"]);

// Define routes that don't require an organization
const noOrgRequiredRoutes = createRouteMatcher([
  "/organizations(.*)",
  "/api/(.*)organizations(.*)",
  "/api/(.*)org(.*)"
]);

export default clerkMiddleware(async (auth, request) => {
  // Allow webhook routes to bypass auth
  if (webhookRoutes(request)) {
    return NextResponse.next();
  }

  // Handle public routes
  if (publicRoutes(request)) {
    // If user is signed in and trying to access public routes, redirect to dashboard
    const isSignedIn = await auth
      .protect()
      .then(() => true)
      .catch(() => false);
      
    if (isSignedIn && request.nextUrl.pathname === "/") {
      const dashboard = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboard);
    }
    return NextResponse.next();
  }

  try {
    // Protect all other routes
    const session = await auth.protect();
    
    // If user is authenticated but has no organization selected and is trying to access protected routes
    // that require an organization, redirect to organizations page
    if (!session.orgId && !noOrgRequiredRoutes(request)) {
      // Add a query parameter to indicate this is a redirect due to missing org
      const orgsPage = new URL("/organizations?reason=no-org-selected", request.url);
      return NextResponse.redirect(orgsPage);
    }
    
    return NextResponse.next();
  } catch {
    // If not authenticated, redirect to sign-in
    const signIn = new URL("/sign-in", request.url);
    return NextResponse.redirect(signIn);
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)",
    "/api/:path*",
  ],
};
