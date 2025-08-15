'use client';

import React, { useEffect, useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useAuth } from '@/contexts/auth-context';
import { getDashboardStats, getRecentActivity } from '@/lib/database';

type ActivityItem = {
    id: string;
    type: 'booking' | 'song';
    description: string;
    status: string;
    created_at: string;
};

function DashboardContent() {
    const { user } = useAuth();
    const [stats, setStats] = useState<{ newBookingRequests: number; pendingSongRequests: number; upcomingEvents: number } | null>(null);
    const [activity, setActivity] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const [s, a] = await Promise.all([
                    getDashboardStats(),
                    getRecentActivity(10),
                ]);
                if (!mounted) return;
                setStats(s);
                setActivity(a as ActivityItem[]);
            } catch (err: any) {
                if (!mounted) return;
                setError(err?.message || 'Failed to load dashboard');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    return (
        <div className="min-h-screen">
            <div className="bg-card border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user?.email}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {loading && (
                    <div className="text-muted-foreground">Loading...</div>
                )}
                {error && (
                    <div className="p-3 rounded border border-red-200 bg-red-50 text-red-700">{error}</div>
                )}

                {stats && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-card rounded-lg border border-border p-5">
                            <div className="text-sm text-muted-foreground">New booking requests</div>
                            <div className="text-3xl font-semibold mt-1 text-foreground">{stats.newBookingRequests}</div>
                        </div>
                        <div className="bg-card rounded-lg border border-border p-5">
                            <div className="text-sm text-muted-foreground">Pending song requests</div>
                            <div className="text-3xl font-semibold mt-1 text-foreground">{stats.pendingSongRequests}</div>
                        </div>
                        <div className="bg-card rounded-lg border border-border p-5">
                            <div className="text-sm text-muted-foreground">Upcoming public events</div>
                            <div className="text-3xl font-semibold mt-1 text-foreground">{stats.upcomingEvents}</div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-card rounded-lg border border-border">
                        <div className="px-5 py-3 border-b border-border font-medium">Recent activity</div>
                        <div className="divide-y">
                            {activity.length === 0 && (
                                <div className="px-5 py-6 text-muted-foreground">No recent activity</div>
                            )}
                            {activity.map((item) => (
                                <div key={item.id} className="px-5 py-4 flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-foreground">{item.description}</div>
                                        <div className="text-xs text-muted-foreground mt-1">{new Date(item.created_at).toLocaleString()}</div>
                                    </div>
                                    <div className="text-xs px-2 py-1 rounded border border-border text-foreground bg-muted">
                                        {item.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-card rounded-lg border border-border p-5">
                        <div className="font-medium mb-3">Quick actions</div>
                        <div className="space-y-2">
                            <a href="/admin/bookings" className="block w-full text-center rounded-md border border-border px-4 py-2 bg-muted hover:bg-muted/80">View bookings</a>
                            <a href="/admin/media" className="block w-full text-center rounded-md border border-border px-4 py-2 bg-muted hover:bg-muted/80">Manage media</a>
                            <a href="/admin/cms" className="block w-full text-center rounded-md border border-border px-4 py-2 bg-muted hover:bg-muted/80">Edit site content</a>
                            <a href="/book" className="block w-full text-center rounded-md border border-border px-4 py-2 bg-muted hover:bg-muted/80">Open booking form</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <AuthGuard>
            <DashboardContent />
        </AuthGuard>
    );
}