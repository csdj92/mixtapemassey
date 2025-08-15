import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './src/types/database';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for static files and API routes (except auth API routes)
    if (
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/api/') ||
        pathname.includes('.') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    // Only protect admin routes
    if (!pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    // Allow access to login page
    if (pathname === '/admin/login') {
        return NextResponse.next();
    }

    // Create Supabase client for middleware
    const supabase = createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );

    try {
        // Get session from cookies
        const accessToken = request.cookies.get('sb-access-token')?.value;
        const refreshToken = request.cookies.get('sb-refresh-token')?.value;

        if (!accessToken || !refreshToken) {
            return redirectToLogin(request);
        }

        // Set the session for the Supabase client
        const { data: { session }, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
        });

        if (error || !session?.user) {
            return redirectToLogin(request);
        }

        // User is authenticated, allow access
        return NextResponse.next();
    } catch (error) {
        console.error('Middleware auth error:', error);
        return redirectToLogin(request);
    }
}

function redirectToLogin(request: NextRequest) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
};