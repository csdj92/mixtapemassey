'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import {
    getSession,
    onAuthStateChange,
    signOut as authSignOut,
    refreshSession
} from '@/lib/auth';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    error: AuthError | null;
    signOut: () => Promise<void>;
    refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<AuthError | null>(null);
    const [mounted, setMounted] = useState(false);

    // Handle hydration
    useEffect(() => {
        setMounted(true);
    }, []);

    // Initialize auth state
    useEffect(() => {
        if (!mounted) return;

        const initializeAuth = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get session first
                const currentSession = await getSession();
                setSession(currentSession);
                setUser(currentSession?.user ?? null);
            } catch (err) {
                console.error('Auth initialization error:', err);
                // Don't set error for missing session - it's expected for logged out users
                if (err && typeof err === 'object' && 'message' in err &&
                    !(err as any).message?.includes('Auth session missing')) {
                    setError(err as AuthError);
                }
                setUser(null);
                setSession(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, [mounted]);

    // Listen for auth state changes
    useEffect(() => {
        if (!mounted) return;

        const { data: { subscription } } = onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event, session);

            setSession(session);
            setUser(session?.user ?? null);
            setError(null);

            // Handle session refresh
            if (event === 'TOKEN_REFRESHED') {
                console.log('Token refreshed successfully');
            }

            // Handle sign out
            if (event === 'SIGNED_OUT') {
                setUser(null);
                setSession(null);
                // Clear any stored auth data
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('supabase.auth.token');
                }
            }

            // Handle sign in
            if (event === 'SIGNED_IN' && session) {
                setUser(session.user);
                setSession(session);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [mounted]);

    // Auto-refresh token before expiry
    useEffect(() => {
        if (!mounted || !session?.expires_at) return;

        const expiresAt = new Date(session.expires_at * 1000);
        const now = new Date();
        const timeUntilExpiry = expiresAt.getTime() - now.getTime();

        // Refresh 5 minutes before expiry
        const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0);

        if (refreshTime > 0) {
            const timeoutId = setTimeout(async () => {
                try {
                    await refreshSession();
                } catch (error) {
                    console.error('Auto refresh failed:', error);
                    setError(error as AuthError);
                }
            }, refreshTime);

            return () => clearTimeout(timeoutId);
        }
    }, [mounted, session?.expires_at]);

    const signOut = async () => {
        try {
            setLoading(true);
            await authSignOut();
            setUser(null);
            setSession(null);
            setError(null);
        } catch (err) {
            console.error('Sign out error:', err);
            setError(err as AuthError);
        } finally {
            setLoading(false);
        }
    };

    const refreshAuth = async () => {
        try {
            setLoading(true);
            setError(null);

            const newSession = await refreshSession();
            setSession(newSession);
            setUser(newSession?.user ?? null);
        } catch (err) {
            console.error('Refresh auth error:', err);
            setError(err as AuthError);
        } finally {
            setLoading(false);
        }
    };

    const value: AuthContextType = {
        user,
        session,
        loading,
        error,
        signOut,
        refreshAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}