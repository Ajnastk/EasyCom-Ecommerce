import { NextResponse } from "next/server";
import { VerifyJwt } from "@/lib/Jwt";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const user = VerifyJwt(token);

  const { pathname } = req.nextUrl;

  // Redirect unauthenticated users trying to access protected pages
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Admin-only protection
  if (pathname.startsWith("/admin") && user.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // User-only protection (optional)
  if (pathname.startsWith("/user") && user.role !== "user") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/profile", "/checkout"],
};
