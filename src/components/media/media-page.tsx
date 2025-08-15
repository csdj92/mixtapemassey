'use client';

import { useState } from 'react';
import { MixesGrid } from './mixes-grid';
import { PhotoGallery } from './photo-gallery';
import type { Mix, MediaPhoto } from '@/types';

interface MediaPageProps {
    mixes: Mix[];
    photos: MediaPhoto[];
}

type TabType = 'mixes' | 'photos';

export function MediaPage({ mixes, photos }: MediaPageProps) {
    const [activeTab, setActiveTab] = useState<TabType>('mixes');

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Media</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Explore my latest mixes and performance photos
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-8">
                    <div className="bg-muted rounded-lg p-1 inline-flex">
                        <button
                            onClick={() => setActiveTab('mixes')}
                            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${activeTab === 'mixes'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Mixes ({mixes.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('photos')}
                            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${activeTab === 'photos'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Photos ({photos.length})
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="max-w-7xl mx-auto">
                    {activeTab === 'mixes' && <MixesGrid mixes={mixes} />}
                    {activeTab === 'photos' && <PhotoGallery photos={photos} />}
                </div>
            </div>
        </div>
    );
}