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
  const publicRoutes = [
    '/', 
    '/login', 
    '/burs',
    '/hakkimizda',
    '/blog-grid',
    '/blog-grid-2',
    '/blog-details',
    '/page-contact',
    '/page-signin',
    '/page-register',
    '/page-reset-password'
  ];
  const isPublicRoute = publicRoutes.some(route => 
    req.nextUrl.pathname === route || 
    req.nextUrl.pathname.startsWith('/burs/') ||
    req.nextUrl.pathname.startsWith('/blog') ||  // All blog routes public
    req.nextUrl.pathname.startsWith('/page-')    // All page- routes public (contact, signin, register, etc.)
  );

  // If trying to access protected route without session
  if (!session && !isPublicRoute) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If logged in and trying to access auth pages
  if (session && (
    req.nextUrl.pathname.startsWith('/login') || 
    req.nextUrl.pathname.startsWith('/register') ||
    req.nextUrl.pathname.startsWith('/page-signin') ||
    req.nextUrl.pathname.startsWith('/page-register')
  )) {
    try {
      // Get user profile to check role
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        const redirectUrl = req.nextUrl.clone();
        // Check for redirect parameter
        const redirectParam = req.nextUrl.searchParams.get('redirect');
        if (redirectParam) {
          // Decode redirect parameter
          try {
            redirectUrl.pathname = decodeURIComponent(redirectParam);
          } catch (e) {
            // If decode fails, use as-is
            redirectUrl.pathname = redirectParam;
          }
          redirectUrl.searchParams.delete('redirect'); // Remove redirect param from URL
        } else if (profile.role === 'admin') {
          redirectUrl.pathname = '/admin/dashboard';
        } else if (profile.role === 'student') {
          redirectUrl.pathname = '/student/dashboard';
        } else if (profile.role === 'organization') {
          redirectUrl.pathname = '/organization/dashboard';
        } else {
          redirectUrl.pathname = '/';
        }
        return NextResponse.redirect(redirectUrl);
      }
    } catch (error) {
      console.error('Middleware redirect error:', error);
      // If error, just continue - let the page handle it
    }
  }

  // Role-based access control
  if (session) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    // Admin routes - only admin can access
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (profile?.role !== 'admin') {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/';
        return NextResponse.redirect(redirectUrl);
      }
    }

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
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, favicon.svg (favicon files)
     * - public (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|icon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
};

