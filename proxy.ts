import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth token
  const authToken = request.cookies.get('auth-token');

  // Admin protected routes
  const adminRoutes = ['/dcp-admin/dashboard', '/dcp-admin/users', '/dcp-admin/certificates'];
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // Teacher protected routes
  const teacherRoutes = ['/teacher/dashboard', '/teacher/certificate'];
  const isTeacherRoute = teacherRoutes.some(route => pathname.startsWith(route));

  // Old dashboard routes (redirect to new admin dashboard)
  if (pathname.startsWith('/dashboard') && pathname !== '/dashboard') {
    if (!authToken) {
      return NextResponse.redirect(new URL('/dcp-admin', request.url));
    }
    // Redirect old dashboard to new admin dashboard
    const newPath = pathname.replace('/dashboard', '/dcp-admin/dashboard');
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Protect admin routes
  if (isAdminRoute) {
    if (!authToken) {
      const loginUrl = new URL('/dcp-admin', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect teacher routes
  if (isTeacherRoute) {
    if (!authToken) {
      const loginUrl = new URL('/teacher-login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect to appropriate dashboard if already logged in
  if ((pathname === '/dcp-admin' || pathname === '/teacher-login') && authToken) {
    try {
      // Decode JWT to check role
      const tokenValue = authToken.value;
      const payload = JSON.parse(Buffer.from(tokenValue.split('.')[1], 'base64').toString());
      
      if (payload.role === 'teacher') {
        return NextResponse.redirect(new URL('/teacher/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/dcp-admin/dashboard', request.url));
      }
    } catch (error) {
      // If token is invalid, let them access login page
      return NextResponse.next();
    }
  }

  // Old login redirect
  if (pathname === '/login') {
    return NextResponse.redirect(new URL('/dcp-admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/dcp-admin/:path*',
    '/teacher/:path*',
    '/login',
    '/teacher-login',
  ]
};
