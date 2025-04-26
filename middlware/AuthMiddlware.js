import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  //Get the token using NextAuth's getToken helper
  const token = await getToken({
    req,
    secret:process.env.JWT_SECRET
  });

  const { pathname } = req.nextUrl;

  // Redirect unauthenticated users trying to access protected pages
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
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
  matcher: ["/admin/:path*", "/user/:path*", "/profile", "/checkout"],
};
