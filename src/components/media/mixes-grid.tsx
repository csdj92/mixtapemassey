'use client';

import { useState } from 'react';
import { MixEmbed } from './mix-embed';
import type { Mix } from '@/types';

interface MixesGridProps {
    mixes: Mix[];
}

export function MixesGrid({ mixes }: MixesGridProps) {
    const [filter, setFilter] = useState<'all' | 'soundcloud' | 'mixcloud' | 'youtube'>('all');

    const filteredMixes = mixes.filter(mix =>
        filter === 'all' || mix.platform === filter
    );

    const platforms = ['all', 'soundcloud', 'mixcloud', 'youtube'] as const;
    const platformCounts = {
        all: mixes.length,
        soundcloud: mixes.filter(m => m.platform === 'soundcloud').length,
        mixcloud: mixes.filter(m => m.platform === 'mixcloud').length,
        youtube: mixes.filter(m => m.platform === 'youtube').length,
    };

    if (mixes.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="bg-muted rounded-lg p-12 max-w-md mx-auto">
                    <div className="text-6xl mb-4">🎵</div>
                    <h3 className="text-xl font-semibold mb-2">No Mixes Yet</h3>
                    <p className="text-muted-foreground">
                        Check back soon for the latest mixes!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Platform Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {platforms.map((platform) => (
                    <button
                        key={platform}
                        onClick={() => setFilter(platform)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${filter === platform
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted-foreground/20'
                            }`}
                        disabled={platformCounts[platform] === 0}
                    >
                        {platform === 'all' ? 'All' : platform.charAt(0).toUpperCase() + platform.slice(1)}
                        {platformCounts[platform] > 0 && (
                            <span className="ml-1">({platformCounts[platform]})</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Mixes Grid */}
            {filteredMixes.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">
                        No mixes found for {filter === 'all' ? 'this filter' : filter}.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredMixes.map((mix) => (
                        <MixEmbed key={mix.id} mix={mix} />
                    ))}
                </div>
            )}
        </div>
    );
}