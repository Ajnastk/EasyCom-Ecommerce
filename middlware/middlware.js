// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Constants
const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/about",
  "/contact",
  "/products",
  "/api/auth/register",
  "/api/auth/session"
];

const PROTECTED_API_PREFIXES = [
  "/api/admin/",
  "/api/user/",
  "/api/protected/"
];

// Helper functions
const isPublicPath = (pathname) => {
  return PUBLIC_PATHS.some(path => 
    pathname === path || 
    pathname.startsWith(`${path}/`) ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/public/')
  );
};

const isProtectedApiPath = (pathname) => {
  return PROTECTED_API_PREFIXES.some(prefix => 
    pathname.startsWith(prefix)
  );
};

const isTokenExpired = (token) => {
  return token?.exp && token.exp * 1000 < Date.now();
};

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Skip middleware for static files and public paths
  if (isPublicPath(pathname)) {
    // Redirect authenticated users away from auth pages
    if (token && (pathname === "/login" || pathname === "/register")) {
      const redirectUrl = token.role === ROLES.ADMIN ? "/admin" : "/";
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
    return NextResponse.next();
  }

  // Handle API routes
  if (pathname.startsWith('/api')) {
    // Allow public API routes
    if (!isProtectedApiPath(pathname)) {
      return NextResponse.next();
    }

    // Check authentication for protected APIs
    if (!token || isTokenExpired(token)) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }

    // Admin API protection
    if (pathname.startsWith('/api/admin/') && token.role !== ROLES.ADMIN) {
      return new NextResponse(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { 'content-type': 'application/json' } }
      );
    }

    // User API protection
    if (pathname.startsWith('/api/user/') && token.role !== ROLES.USER) {
      return new NextResponse(
        JSON.stringify({ error: 'User access required' }),
        { status: 403, headers: { 'content-type': 'application/json' } }
      );
    }

    return NextResponse.next();
  }

  // Handle page routes
  if (!token || isTokenExpired(token)) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin page protection
  if (pathname.startsWith("/admin") && token.role !== ROLES.ADMIN) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // User page protection
  if (pathname.startsWith("/user") && token.role !== ROLES.USER) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except those starting with:
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};