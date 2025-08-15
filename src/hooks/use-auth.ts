'use client';

import { useState, useCallback } from 'react';
import { useAuth as useAuthContext } from '@/contexts/auth-context';
import { signInWithEmail, getAuthErrorMessage } from '@/lib/auth';
import type { AuthError } from '@supabase/supabase-js';

interface UseAuthReturn {
    // State
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    signIn: (email: string) => Promise<boolean>;
    signOut: () => Promise<void>;
    clearError: () => void;
}

export function useAuth(): UseAuthReturn {
    const { user, session, loading, error: contextError, signOut: contextSignOut } = useAuthContext();
    const [localLoading, setLocalLoading] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const isAuthenticated = !!user && !!session;
    const isLoading = loading || localLoading;
    const error = localError || (contextError ? getAuthErrorMessage(contextError) : null);

    const signIn = useCallback(async (email: string): Promise<boolean> => {
        try {
            setLocalLoading(true);
            setLocalError(null);

            await signInWithEmail(email);
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error
                ? getAuthErrorMessage(err as AuthError)
                : 'An unexpected error occurred';
            setLocalError(errorMessage);
            return false;
        } finally {
            setLocalLoading(false);
        }
    }, []);

    const signOut = useCallback(async () => {
        try {
            setLocalLoading(true);
            setLocalError(null);
            await contextSignOut();
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'Failed to sign out';
            setLocalError(errorMessage);
        } finally {
            setLocalLoading(false);
        }
    }, [contextSignOut]);

    const clearError = useCallback(() => {
        setLocalError(null);
    }, []);

    return {
        isAuthenticated,
        isLoading,
        error,
        signIn,
        signOut,
        clearError,
    };
}

// Hook for checking admin status
export function useAdmin() {
    const { user, session, loading } = useAuthContext();

    return {
        isAdmin: !!user && !!session,
        isLoading: loading,
        user,
    };
}

// Hook for protecting routes
export function useRequireAuth() {
    const { user, session, loading } = useAuthContext();
    const isAuthenticated = !!user && !!session;

    return {
        isAuthenticated,
        isLoading: loading,
        shouldRedirect: !loading && !isAuthenticated,
    };
}