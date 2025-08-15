import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Create a Supabase client for middleware (server-side)
const createMiddlewareClient = (request: NextRequest) => {
    return createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
                detectSessionInUrl: false,
            },
            global: {
                headers: {
                    Authorization: request.headers.get('Authorization') || '',
                },
            },
        }
    );
};

// Middleware function to protect admin routes
export async function withAuth(
    request: NextRequest,
    handler: (request: NextRequest) => Promise<NextResponse> | NextResponse
): Promise<NextResponse> {
    const supabase = createMiddlewareClient(request);

    try {
        // Get session from request
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session?.user) {
            // Redirect to login if not authenticated
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
        }

        // User is authenticated, proceed with the request
        return handler(request);
    } catch (error) {
        console.error('Auth middleware error:', error);
        // Redirect to login on any auth error
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
    }
}

// Helper function to check if a path requires authentication
export function requiresAuth(pathname: string): boolean {
    const protectedPaths = ['/admin'];
    const publicPaths = ['/admin/login'];

    // Check if it's a public admin path
    if (publicPaths.some(path => pathname.startsWith(path))) {
        return false;
    }

    // Check if it's a protected path
    return protectedPaths.some(path => pathname.startsWith(path));
}

// Extract session from request cookies
export function getSessionFromRequest(request: NextRequest) {
    const sessionCookie = request.cookies.get('sb-access-token');
    const refreshCookie = request.cookies.get('sb-refresh-token');

    if (!sessionCookie || !refreshCookie) {
        return null;
    }

    return {
        access_token: sessionCookie.value,
        refresh_token: refreshCookie.value,
    };
}