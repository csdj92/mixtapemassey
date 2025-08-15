'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { getAllMixes, getMediaPhotos, bulkUpdateMixOrder, createMediaPhoto, deleteMediaPhoto, updateMediaPhoto } from '@/lib/database';
import { uploadPressPhoto, uploadPerformancePhoto } from '@/lib/storage';
import type { Mix, MediaPhoto } from '@/types';

function AdminMediaContent() {
    const [mixes, setMixes] = useState<Mix[]>([]);
    const [photos, setPhotos] = useState<MediaPhoto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newPhotoType, setNewPhotoType] = useState<'press' | 'performance'>('performance');
    const [newAltText, setNewAltText] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const [m, p] = await Promise.all([getAllMixes(), getMediaPhotos()]);
                setMixes(m);
                setPhotos(p);
            } catch (err: any) {
                setError(err?.message || 'Failed to load media');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const moveMix = (index: number, direction: -1 | 1) => {
        setMixes((prev) => {
            const next = [...prev];
            const target = index + direction;
            if (target < 0 || target >= next.length) return prev;
            const [item] = next.splice(index, 1);
            next.splice(target, 0, item);
            return next.map((m, i) => ({ ...m, display_order: i + 1 }));
        });
    };

    const saveOrder = async () => {
        try {
            setSaving(true);
            await bulkUpdateMixOrder(mixes.map(m => ({ id: m.id, display_order: m.display_order })));
        } catch (err: any) {
            setError(err?.message || 'Failed to save order');
        } finally {
            setSaving(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        try {
            setUploading(true);
            setError(null);
            const file = files[0];
            const { publicUrl } = newPhotoType === 'press' ? await uploadPressPhoto(file) : await uploadPerformancePhoto(file);
            const created = await createMediaPhoto({
                url: publicUrl,
                alt_text: newAltText || null,
                is_press: newPhotoType === 'press',
                display_order: photos.length + 1,
            } as any);
            setPhotos((prev) => [...prev, created]);
            setNewAltText('');
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err: any) {
            setError(err?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDeletePhoto = async (id: string) => {
        try {
            await deleteMediaPhoto(id);
            setPhotos((prev) => prev.filter((p) => p.id !== id));
        } catch (err: any) {
            setError(err?.message || 'Failed to delete photo');
        }
    };

    const togglePress = async (p: MediaPhoto) => {
        try {
            const updated = await updateMediaPhoto(p.id, { is_press: !p.is_press });
            setPhotos((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
        } catch (err: any) {
            setError(err?.message || 'Failed to update photo');
        }
    };

    return (
        <div className="min-h-screen">
            <div className="bg-card border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-2xl font-bold text-foreground">Media Management</h1>
                    <p className="text-muted-foreground">Reorder mixes and review uploaded photos</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {loading && <div className="text-muted-foreground">Loading...</div>}
                {error && <div className="p-3 rounded border border-red-200 bg-red-50 text-red-700">{error}</div>}

                {/* Mixes reorder */}
                <div className="bg-card rounded-lg border border-border">
                    <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                        <div className="font-medium">Featured mixes order</div>
                        <button
                            onClick={saveOrder}
                            disabled={saving}
                            className="px-3 py-1.5 rounded-md text-sm border border-border bg-card hover:bg-muted disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save order'}
                        </button>
                    </div>
                    <ul className="divide-y">
                        {mixes.map((m, i) => (
                            <li key={m.id} className="flex items-center justify-between px-5 py-3">
                                <div>
                                    <div className="font-medium text-foreground">{m.title}</div>
                                    <div className="text-xs text-muted-foreground">{m.platform} · order {m.display_order}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => moveMix(i, -1)} className="px-2 py-1 rounded border border-border text-xs bg-card hover:bg-muted">Up</button>
                                    <button onClick={() => moveMix(i, 1)} className="px-2 py-1 rounded border border-border text-xs bg-card hover:bg-muted">Down</button>
                                </div>
                            </li>
                        ))}
                        {mixes.length === 0 && (
                            <li className="px-5 py-4 text-muted-foreground">No mixes</li>
                        )}
                    </ul>
                </div>

                {/* Photos grid */}
                <div className="bg-card rounded-lg border border-border">
                    <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                        <div className="font-medium">Photos</div>
                        <div className="flex items-center gap-2">
                            <select
                                className="border border-border rounded px-2 py-1 text-sm bg-background"
                                value={newPhotoType}
                                onChange={(e) => setNewPhotoType(e.target.value as any)}
                            >
                                <option value="performance">Performance</option>
                                <option value="press">Press</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Alt text (optional)"
                                className="border border-border rounded px-2 py-1 text-sm bg-background"
                                value={newAltText}
                                onChange={(e) => setNewAltText(e.target.value)}
                            />
                            <label className="px-3 py-1.5 rounded-md text-sm border border-border bg-card hover:bg-muted cursor-pointer">
                                {uploading ? 'Uploading...' : 'Upload photo'}
                                <input ref={fileInputRef} onChange={handleUpload} type="file" accept="image/*" className="hidden" />
                            </label>
                        </div>
                    </div>
                    <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {photos.map((p) => (
                            <div key={p.id} className="aspect-square rounded overflow-hidden bg-gray-100 relative group">
                                <img src={p.url} alt={p.alt_text ?? ''} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-start justify-end p-2 gap-2">
                                    <button onClick={() => togglePress(p)} className="px-2 py-1 text-xs rounded bg-white/90 hover:bg-white">
                                        {p.is_press ? 'Unmark Press' : 'Mark Press'}
                                    </button>
                                    <button onClick={() => handleDeletePhoto(p.id)} className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                        {photos.length === 0 && (
                            <div className="text-muted-foreground">No photos</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminMediaPage() {
    return (
        <AuthGuard>
            <AdminMediaContent />
        </AuthGuard>
    );
}


