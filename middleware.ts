import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes
const publicRoutes = createRouteMatcher(["/", "/sign-in", "/sign-up"]);

// Define webhook routes that should bypass auth
const webhookRoutes = createRouteMatcher(["/api/webhook/postmark"]);

export default clerkMiddleware(async (auth, request) => {
  // Allow webhook routes to bypass auth
  if (webhookRoutes(request)) {
    return NextResponse.next();
  }

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

  // Protect all other routes
  const signedIn = await auth.protect();
  if (!signedIn) {
    const home = new URL("/", request.url);
    return NextResponse.redirect(home);
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
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/api/:path*",
  ],
};
