import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export async function POST() {
    const supabase = createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    try {
        // Sign out from Supabase
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('Logout error:', error);
            return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
        }

        // Create response
        const response = NextResponse.json({ success: true });

        // Clear auth cookies
        response.cookies.delete('sb-access-token');
        response.cookies.delete('sb-refresh-token');

        return response;
    } catch (error) {
        console.error('Logout exception:', error);
        return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
    }
}