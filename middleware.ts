import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

const protectedRoutes = ['/dashboard', '/profile'];
const publicRoutes = ['/login', '/register', '/'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = req.cookies.get('session')?.value;
  const session = cookie ? await decrypt(cookie).catch(() => null) : null;

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (isPublicRoute && session && path !== '/') {
    const dashboardPath = session.user.userType === 'employer' ? '/dashboard/employer' : '/dashboard/candidate';
    return NextResponse.redirect(new URL(dashboardPath, req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
