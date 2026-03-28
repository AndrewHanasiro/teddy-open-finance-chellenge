import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // 1. Check for your auth token (cookie, header, etc.)
  const token = request.cookies.get('auth_token')?.value;

  // 2. Define protected paths
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/clients');

  // 3. Redirect to login if trying to access protected route without token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// 4. Optimize performance by filtering middleware to run only on specific paths
export const config = {
  matcher: ['/clients/:path*'],
};
