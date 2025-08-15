'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface LogoutButtonProps {
    className?: string;
    children?: React.ReactNode;
    variant?: 'button' | 'link';
}

export function LogoutButton({
    className = '',
    children,
    variant = 'button'
}: LogoutButtonProps) {
    const { signOut } = useAuth();
    const [busy, setBusy] = useState(false);

    const handleLogout = async () => {
        try {
            if (busy) return;
            setBusy(true);
            await signOut();
            // Redirect to home page after logout
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
        }
        finally {
            setBusy(false);
        }
    };

    const baseClasses = variant === 'button'
        ? 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed'
        : 'text-red-600 hover:text-red-500 font-medium';

    return (
        <button
            onClick={handleLogout}
            disabled={busy}
            className={`${baseClasses} ${className}`}
        >
            {busy ? (
                <div className="flex items-center">
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    Signing out...
                </div>
            ) : (
                children || 'Sign Out'
            )}
        </button>
    );
}