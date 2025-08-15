'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/hooks/use-auth';
import { ClientOnly } from '@/components/client-only';

interface AuthGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    redirectTo?: string | undefined;
}

function AuthGuardContent({
    children,
    fallback,
    redirectTo = '/admin/login'
}: AuthGuardProps) {
    const { isAuthenticated, isLoading, shouldRedirect } = useRequireAuth();
    const router = useRouter();

    useEffect(() => {
        if (shouldRedirect) {
            const currentPath = window.location.pathname;
            const loginUrl = `${redirectTo}?redirectTo=${encodeURIComponent(currentPath)}`;
            router.push(loginUrl);
        }
    }, [shouldRedirect, router, redirectTo]);

    if (isLoading) {
        return (
            fallback || (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </div>
            )
        );
    }

    if (!isAuthenticated) {
        return (
            fallback || (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-600">Redirecting to login...</p>
                    </div>
                </div>
            )
        );
    }

    return <>{children}</>;
}

export function AuthGuard(props: AuthGuardProps) {
    return (
        <ClientOnly
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </div>
            }
        >
            <AuthGuardContent {...props} />
        </ClientOnly>
    );
}

// Higher-order component version
export function withAuthGuard<P extends object>(
    Component: React.ComponentType<P>,
    options?: {
        fallback?: React.ReactNode;
        redirectTo?: string;
    }
) {
    return function AuthGuardedComponent(props: P) {
        return (
            <AuthGuard
                fallback={options?.fallback}
                redirectTo={options?.redirectTo}
            >
                <Component {...props} />
            </AuthGuard>
        );
    };
}