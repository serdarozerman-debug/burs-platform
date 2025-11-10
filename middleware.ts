import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Skip middleware for API routes, static files, and images
  if (
    req.nextUrl.pathname.startsWith('/api/') ||
    req.nextUrl.pathname.startsWith('/_next/') ||
    req.nextUrl.pathname.startsWith('/static/')
  ) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Public routes (no auth required)
  const publicRoutes = ['/', '/login', '/register', '/burs'];
  const isPublicRoute = publicRoutes.some(route => 
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith('/burs/')
  );

  // If trying to access protected route without session
  if (!session && !isPublicRoute) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If logged in and trying to access auth pages
  if (session && (req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register'))) {
    // Get user profile to check role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = profile.role === 'student' ? '/student/dashboard' : '/organization/dashboard';
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Role-based access control
  if (session) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    // Student trying to access organization routes
    if (profile?.role === 'student' && req.nextUrl.pathname.startsWith('/organization')) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/student/dashboard';
      return NextResponse.redirect(redirectUrl);
    }

    // Organization trying to access student routes
    if (profile?.role === 'organization' && req.nextUrl.pathname.startsWith('/student')) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/organization/dashboard';
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};

