// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Role constants
const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

// Helper: Define public paths
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/about",
  "/contact",
  "/api/auth/register"
];

// Helper: Check if a route is public
function isPublicPath(pathname) {
  return PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(`${path}/`));
}

// Helper: Check if API path is safe without auth
function isUnprotectedApiPath(pathname) {
  return pathname.startsWith("/api/") && !pathname.startsWith("/api/protected/");
}

// Helper: Check if token is expired
function isTokenExpired(token) {
  return token?.exp && token.exp * 1000 < Date.now();
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  });

  // Handle public and unprotected API paths
  if (isPublicPath(pathname) || isUnprotectedApiPath(pathname)) {
    if (token && (pathname === "/login" || pathname === "/register")) {
      const redirectUrl = token.role === ROLES.ADMIN ? "/admin/dashboard" : "/user/dashboard";
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
    return NextResponse.next();
  }

  // Redirect to login if no token or expired
  if (!token || isTokenExpired(token)) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin-only protection
  if (pathname.startsWith("/admin") && token.role !== ROLES.ADMIN) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // User-only protection
  if (pathname.startsWith("/user") && token.role !== ROLES.USER) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply to all routes except static/image/favicon/public assets
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
