import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

/**
 * Middleware to protect routes and redirect unauthenticated users
 * 
 * Usage:
 * 1. Add route patterns to matcher in config below
 * 2. Check for auth in middleware
 * 
 * Example protected routes:
 * - /admin/* - Only admins
 * - /dashboard/* - Authenticated users only
 */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes
  const adminRoutes = ["/admin"];
  const protectedRoutes = ["/dashboard"];

  // Check if route needs protection
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isAdminRoute || isProtectedRoute) {
    // Get session from cookie
    // Note: Direct cookie parsing in middleware - iron-session requires cookies() which is not available in middleware
    // Alternative: Check session via a quick DB query or implement custom session check
    
    // For now, let components handle auth checks via getLoggedUser()
    // Or create a separate session lookup function for middleware
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
