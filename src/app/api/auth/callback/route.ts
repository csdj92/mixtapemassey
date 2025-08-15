import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/admin/dashboard';

    if (code) {
        const supabase = createClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        try {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);

            if (error) {
                console.error('Auth callback error:', error);
                return NextResponse.redirect(`${origin}/admin/login?error=auth_error`);
            }

            if (data.session) {
                // Create response with redirect
                const response = NextResponse.redirect(`${origin}${next}`);

                // Set session cookies
                response.cookies.set('sb-access-token', data.session.access_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: data.session.expires_in,
                    path: '/',
                });

                response.cookies.set('sb-refresh-token', data.session.refresh_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 * 30, // 30 days
                    path: '/',
                });

                return response;
            }
        } catch (error) {
            console.error('Auth callback exception:', error);
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/admin/login?error=auth_callback_error`);
}