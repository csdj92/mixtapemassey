'use client';

import React, { useEffect, useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { getSettings, updateSettings, getAllMixes, createMix, updateMix, deleteMix } from '@/lib/database';
import type { Settings, Mix } from '@/types';
import { uploadLogo, uploadTechRider } from '@/lib/storage';

function CMSContent() {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [mixes, setMixes] = useState<Mix[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const [newMix, setNewMix] = useState<{ title: string; platform: Mix['platform']; url: string; featured: boolean }>(
        { title: '', platform: 'soundcloud', url: '', featured: false }
    );

    useEffect(() => {
        (async () => {
            try {
                const [s, m] = await Promise.all([getSettings(), getAllMixes()]);
                setSettings(s);
                setMixes(m);
            } catch (err: any) {
                setError(err?.message || 'Failed to load CMS data');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const saveSettings = async () => {
        if (!settings) return;
        try {
            setSaving(true);
            const updated = await updateSettings({
                site_title: settings.site_title,
                hero_heading: settings.hero_heading,
                hero_sub: settings.hero_sub,
                bio: settings.bio || undefined,
                socials: settings.socials,
                rider_file_url: settings.rider_file_url || undefined,
                logo_url: settings.logo_url || undefined,
            });
            setSettings(updated);
        } catch (err: any) {
            setError(err?.message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleLogoUpload = async (file?: File) => {
        if (!file || !settings) return;
        try {
            const { publicUrl } = await uploadLogo(file);
            setSettings({ ...settings, logo_url: publicUrl });
        } catch (err: any) {
            setError(err?.message || 'Logo upload failed');
        }
    };

    const handleRiderUpload = async (file?: File) => {
        if (!file || !settings) return;
        try {
            const { publicUrl } = await uploadTechRider(file);
            setSettings({ ...settings, rider_file_url: publicUrl });
        } catch (err: any) {
            setError(err?.message || 'Rider upload failed');
        }
    };

    const addMix = async () => {
        try {
            const created = await createMix({ ...newMix, display_order: mixes.length + 1 });
            setMixes((prev) => [...prev, created]);
            setNewMix({ title: '', platform: 'soundcloud', url: '', featured: false });
        } catch (err: any) {
            setError(err?.message || 'Failed to add mix');
        }
    };

    const removeMix = async (id: string) => {
        try {
            await deleteMix(id);
            setMixes((prev) => prev.filter((m) => m.id !== id));
        } catch (err: any) {
            setError(err?.message || 'Failed to delete mix');
        }
    };

    const toggleMixFeatured = async (mix: Mix) => {
        try {
            const updated = await updateMix(mix.id, { featured: !mix.featured });
            setMixes((prev) => prev.map((m) => (m.id === mix.id ? updated : m)));
        } catch (err: any) {
            setError(err?.message || 'Failed to update mix');
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;

    return (
        <div className="min-h-screen">
            <div className="bg-card border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-2xl font-bold text-foreground">Content Management</h1>
                    <p className="text-muted-foreground">Edit homepage copy, bio, hero images, and manage mixes</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Settings Editor */}
                {settings && (
                    <div className="bg-card rounded-lg border border-border">
                        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                            <div className="font-medium">Homepage & About Content</div>
                            <button onClick={saveSettings} disabled={saving} className="px-3 py-1.5 rounded-md text-sm border border-border bg-card hover:bg-muted disabled:opacity-50">
                                {saving ? 'Saving...' : 'Save changes'}
                            </button>
                        </div>
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Site title</span>
                                <input value={settings.site_title || ''} onChange={(e) => setSettings({ ...settings, site_title: e.target.value })} className="border border-border rounded px-3 py-2 bg-background" />
                            </label>
                            <label className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Hero heading</span>
                                <input value={settings.hero_heading || ''} onChange={(e) => setSettings({ ...settings, hero_heading: e.target.value })} className="border border-border rounded px-3 py-2 bg-background" />
                            </label>
                            <label className="flex flex-col gap-1 md:col-span-2">
                                <span className="text-sm text-muted-foreground">Hero subheading</span>
                                <input value={settings.hero_sub || ''} onChange={(e) => setSettings({ ...settings, hero_sub: e.target.value })} className="border border-border rounded px-3 py-2 bg-background" />
                            </label>
                            <label className="flex flex-col gap-1 md:col-span-2">
                                <span className="text-sm text-muted-foreground">Bio</span>
                                <textarea value={settings.bio || ''} onChange={(e) => setSettings({ ...settings, bio: e.target.value })} className="border border-border rounded px-3 py-2 bg-background min-h-[120px]" />
                            </label>
                            <div className="flex items-center gap-3 md:col-span-2">
                                <div className="flex-1">
                                    <div className="text-sm text-muted-foreground mb-1">Logo</div>
                                    <div className="flex items-center gap-3">
                                        {settings.logo_url && <img src={settings.logo_url} alt="logo" className="h-10 w-10 object-contain" />}
                                        <label className="px-3 py-1.5 rounded-md text-sm border border-border bg-card hover:bg-muted cursor-pointer">
                                            Upload logo
                                            <input onChange={(e) => handleLogoUpload(e.target.files?.[0])} type="file" accept="image/*" className="hidden" />
                                        </label>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm text-muted-foreground mb-1">Tech rider</div>
                                    <div className="flex items-center gap-3">
                                        {settings.rider_file_url && <a href={settings.rider_file_url} className="text-sm underline" target="_blank" rel="noreferrer">Current file</a>}
                                        <label className="px-3 py-1.5 rounded-md text-sm border border-border bg-card hover:bg-muted cursor-pointer">
                                            Upload rider
                                            <input onChange={(e) => handleRiderUpload(e.target.files?.[0])} type="file" accept="application/pdf,.doc,.docx" className="hidden" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mixes Manager */}
                <div className="bg-card rounded-lg border border-border">
                    <div className="px-5 py-3 border-b border-border font-medium">Mixes</div>
                    <div className="p-5 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                            <input placeholder="Title" value={newMix.title} onChange={(e) => setNewMix({ ...newMix, title: e.target.value })} className="border border-border rounded px-3 py-2 bg-background" />
                            <select value={newMix.platform} onChange={(e) => setNewMix({ ...newMix, platform: e.target.value as Mix['platform'] })} className="border border-border rounded px-3 py-2 bg-background">
                                <option value="soundcloud">SoundCloud</option>
                                <option value="mixcloud">Mixcloud</option>
                                <option value="youtube">YouTube</option>
                            </select>
                            <input placeholder="URL" value={newMix.url} onChange={(e) => setNewMix({ ...newMix, url: e.target.value })} className="border border-border rounded px-3 py-2 bg-background" />
                            <div className="flex items-center gap-2">
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" checked={newMix.featured} onChange={(e) => setNewMix({ ...newMix, featured: e.target.checked })} />
                                    Featured
                                </label>
                                <button onClick={addMix} className="ml-auto px-3 py-2 rounded-md border border-border bg-card hover:bg-muted text-sm">Add mix</button>
                            </div>
                        </div>
                        <ul className="divide-y">
                            {mixes.map((m) => (
                                <li key={m.id} className="flex items-center justify-between py-2">
                                    <div>
                                        <div className="font-medium text-foreground">{m.title}</div>
                                        <div className="text-xs text-muted-foreground">{m.platform} · {m.featured ? 'featured' : 'not featured'}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => toggleMixFeatured(m)} className="px-2 py-1 rounded border border-border text-xs bg-card hover:bg-muted">{m.featured ? 'Unfeature' : 'Feature'}</button>
                                        <button onClick={() => removeMix(m.id)} className="px-2 py-1 rounded border border-border text-xs bg-red-600 text-white hover:bg-red-700">Delete</button>
                                    </div>
                                </li>
                            ))}
                            {mixes.length === 0 && <li className="py-4 text-muted-foreground">No mixes</li>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CMSPage() {
    return (
        <AuthGuard>
            <CMSContent />
        </AuthGuard>
    );
}


