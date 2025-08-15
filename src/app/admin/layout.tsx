'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/components/auth/logout-button';
import { ThemeToggle } from '@/components/layout/theme-toggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { href: '/admin/dashboard', label: 'Dashboard' },
        { href: '/admin/bookings', label: 'Bookings' },
        { href: '/admin/media', label: 'Media' },
        { href: '/admin/cms', label: 'CMS' },
    ];

    const isLogin = pathname === '/admin/login';

    return (
            <div className="min-h-screen bg-background text-foreground flex">
                {/* Sidebar */}
                {!isLogin && (
                <aside className="w-64 bg-card border-r border-border hidden md:flex md:flex-col">
                    <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                        <span className="text-lg font-semibold">Admin</span>
                        <ThemeToggle />
                    </div>
                    <nav className="flex-1 px-2 py-4 space-y-1">
                        {navItems.map((item) => {
                            const active = pathname?.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={
                                        `block rounded-md px-3 py-2 text-sm transition-colors ` +
                                        (active
                                            ? 'bg-muted text-foreground'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground')
                                    }
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="px-4 py-4 border-t border-border">
                        <LogoutButton />
                    </div>
                </aside>
                )}

                {/* Mobile top bar */}
                {!isLogin && (
                <div className="md:hidden fixed top-0 inset-x-0 h-14 bg-background border-b border-border flex items-center justify-between px-4 z-10">
                    <span className="font-semibold">Admin</span>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link href="/admin/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Dashboard</Link>
                        <Link href="/admin/bookings" className="text-sm text-muted-foreground hover:text-foreground">Bookings</Link>
                        <Link href="/admin/media" className="text-sm text-muted-foreground hover:text-foreground">Media</Link>
                        <Link href="/admin/cms" className="text-sm text-muted-foreground hover:text-foreground">CMS</Link>
                    </div>
                </div>
                )}

                {/* Main content */}
                <main className="flex-1 min-w-0 md:ml-0 md:pl-0 w-full">
                    <div className="md:ml-0 w-full md:pt-0 pt-14">
                        {children}
                    </div>
                </main>
            </div>
    );
}


