import { supabase } from './supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

export interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
    error: AuthError | null;
}

// Authentication utilities
export const signInWithEmail = async (email: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: `${window.location.origin}/admin/dashboard`,
            shouldCreateUser: false // Only allow existing users
        }
    });

    if (error) throw error;
    return data;
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error && !error.message?.includes('Auth session missing')) {
            throw error;
        }
        return user;
    } catch (error) {
        // Return null for session missing errors instead of throwing
        if (error && typeof error === 'object' && 'message' in error &&
            (error as any).message?.includes('Auth session missing')) {
            return null;
        }
        throw error;
    }
};

export const getSession = async (): Promise<Session | null> => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error && !error.message?.includes('Auth session missing')) {
            throw error;
        }
        return session;
    } catch (error) {
        // Return null for session missing errors instead of throwing
        if (error && typeof error === 'object' && 'message' in error &&
            (error as any).message?.includes('Auth session missing')) {
            return null;
        }
        throw error;
    }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
    const session = await getSession();
    return !!session?.user;
};

// Check if user is admin (authenticated user)
export const isAdmin = async (): Promise<boolean> => {
    const user = await getCurrentUser();
    return !!user;
};

// Refresh session
export const refreshSession = async (): Promise<Session | null> => {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return session;
};

// Auth state change listener
export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback);
};

// Verify email token (for magic link authentication)
export const verifyOtp = async (token: string, email: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
        token,
        email,
        type: 'email'
    });

    if (error) throw error;
    return data;
};

// Get auth error message
export const getAuthErrorMessage = (error: AuthError): string => {
    switch (error.message) {
        case 'Invalid login credentials':
            return 'Invalid email or password';
        case 'Email not confirmed':
            return 'Please check your email and click the confirmation link';
        case 'User not found':
            return 'No account found with this email address';
        case 'Too many requests':
            return 'Too many login attempts. Please try again later';
        default:
            return error.message || 'An authentication error occurred';
    }
};