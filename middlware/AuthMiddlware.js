// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  // Get the token using NextAuth's getToken helper
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  });

  const { pathname } = req.nextUrl;

  // Define public paths that don't require authentication
  const isPublicPath = [
    '/', 
    '/login', 
    '/register', 
    '/api/auth/register', 
    '/about',
    '/contact'
  ].some(path => pathname === path || pathname.startsWith(`${path}/`));
  
  // Define API paths that should be excluded from auth checks
  const isApiPath = pathname.startsWith('/api/') && 
    !pathname.startsWith('/api/protected/');

  // Allow public paths and API paths that don't need protection
  if (isPublicPath || isApiPath) {
    // If user is logged in and trying to access login/register, redirect to dashboard
    if (token && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(
        new URL(
          token.role === 'admin' ? '/admin/dashboard' : '/user/dashboard',
          req.url
        )
      );
    }
    return NextResponse.next();
  }

  // For protected routes, check if user is authenticated
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin-only protection
  if (pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // User-only protection (optional)
  if (pathname.startsWith("/user") && token.role !== "user") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that don't need protection
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};