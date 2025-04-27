// middleware/cors.js
import { NextResponse } from "next/server";

export function middleware(req) {
  // Get the origin from the request
  const origin = req.headers.get('origin');
  
  // Response object
  const response = NextResponse.next();
  
  // CORS headers
  response.headers.set('Access-Control-Allow-Origin',process.env.NODE_ENV === 'production' ?'https://easy-com.vercel.app' : '*'); // Change to specific origins in production
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { 
      status: 204,
      headers: response.headers,
    });
  }
  
  return response;
}

export const config = {
  matcher: '/api/:path*',  // Apply only to API routes
};