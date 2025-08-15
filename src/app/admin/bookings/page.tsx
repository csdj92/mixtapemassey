'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { getBookingRequests, updateBookingRequestStatus } from '@/lib/database';
import type { BookingRequest } from '@/types';

type Filter = 'all' | 'new' | 'approved' | 'declined';

function AdminBookingsContent() {
    const [requests, setRequests] = useState<BookingRequest[]>([]);
    const [filter, setFilter] = useState<Filter>('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await getBookingRequests();
                setRequests(data);
            } catch (err: any) {
                setError(err?.message || 'Failed to load booking requests');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filtered = useMemo(() => {
        if (filter === 'all') return requests;
        return requests.filter(r => r.status === filter);
    }, [requests, filter]);

    const counts = useMemo(() => ({
        all: requests.length,
        new: requests.filter(r => r.status === 'new').length,
        approved: requests.filter(r => r.status === 'approved').length,
        declined: requests.filter(r => r.status === 'declined').length,
    }), [requests]);

    const updateStatus = async (id: string, status: BookingRequest['status']) => {
        try {
            setUpdatingId(id);
            const updated = await updateBookingRequestStatus(id, status);
            setRequests(prev => prev.map(r => r.id === id ? updated : r));
        } catch (err: any) {
            setError(err?.message || 'Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="bg-card border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-2xl font-bold text-foreground">Booking Requests</h1>
                    <p className="text-muted-foreground">Review and manage incoming booking requests</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading && <div className="text-muted-foreground">Loading...</div>}
                {error && <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-red-700">{error}</div>}

                {/* Filters */}
                <div className="flex gap-2 mb-4 flex-wrap">
                    {(['all', 'new', 'approved', 'declined'] as Filter[]).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-md text-sm border ${filter === f ? 'bg-foreground text-background border-foreground' : 'bg-card text-foreground hover:bg-muted border-border'}`}
                        >
                            {f[0].toUpperCase() + f.slice(1)} ({counts[f]})
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="overflow-x-auto bg-card rounded-lg border border-border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted border-b border-border">
                            <tr>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Venue</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Budget</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filtered.map((r) => (
                                <tr key={r.id} className="align-top">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-foreground">{r.name}</div>
                                        {r.message && (
                                            <div className="text-muted-foreground max-w-xl line-clamp-2 mt-1">{r.message}</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-foreground">{r.email}</td>
                                    <td className="px-4 py-3 text-foreground">{r.venue || '-'}</td>
                                    <td className="px-4 py-3 text-foreground">{r.event_date ? new Date(r.event_date).toLocaleDateString() : '-'}</td>
                                    <td className="px-4 py-3 text-foreground">{r.budget_range || '-'}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs border border-border bg-muted text-foreground">{r.status}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                disabled={updatingId === r.id}
                                                onClick={() => updateStatus(r.id, 'approved')}
                                                className="px-2.5 py-1.5 rounded-md text-xs border border-border bg-card hover:bg-muted disabled:opacity-50"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                disabled={updatingId === r.id}
                                                onClick={() => updateStatus(r.id, 'declined')}
                                                className="px-2.5 py-1.5 rounded-md text-xs border border-border bg-card hover:bg-muted disabled:opacity-50"
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">No requests</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default function AdminBookingsPage() {
    return (
        <AuthGuard>
            <AdminBookingsContent />
        </AuthGuard>
    );
}


