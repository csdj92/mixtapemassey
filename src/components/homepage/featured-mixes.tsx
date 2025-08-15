'use client';

import { useState, useEffect } from 'react';
import { getFeaturedMixes } from '@/lib/database';
import type { Mix } from '@/types';

interface FeaturedMixesProps {
    mixes?: Mix[] | undefined;
}

export function FeaturedMixes({ mixes }: FeaturedMixesProps) {
    const [isLoading, setIsLoading] = useState(!mixes);
    const [featuredMixes, setFeaturedMixes] = useState<Mix[]>(mixes || []);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!mixes) {
            const fetchMixes = async () => {
                try {
                    const data = await getFeaturedMixes();
                    setFeaturedMixes(data);
                } catch (error) {
                    console.error('Failed to fetch featured mixes:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchMixes();
        }
    }, [mixes]);

    // Auto-advance carousel
    useEffect(() => {
        if (featuredMixes.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % featuredMixes.length);
            }, 5000); // Change every 5 seconds

            return () => clearInterval(interval);
        }
    }, [featuredMixes.length]);

    const getEmbedUrl = (mix: Mix) => {
        switch (mix.platform) {
            case 'soundcloud':
                // Extract track ID from SoundCloud URL
                const soundcloudMatch = mix.url.match(/soundcloud\.com\/[^\/]+\/([^\/\?]+)/);
                if (soundcloudMatch) {
                    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(mix.url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
                }
                break;

            case 'mixcloud':
                // Extract username and mix name from Mixcloud URL
                const mixcloudMatch = mix.url.match(/mixcloud\.com\/([^\/]+)\/([^\/\?]+)/);
                if (mixcloudMatch) {
                    return `https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=${encodeURIComponent(mix.url)}`;
                }
                break;

            case 'youtube':
                // Extract video ID from YouTube URL
                const youtubeMatch = mix.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                if (youtubeMatch) {
                    return `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0&modestbranding=1&showinfo=0`;
                }
                break;
        }
        return null;
    };

    const nextMix = () => {
        setCurrentIndex((prev) => (prev + 1) % featuredMixes.length);
    };

    const prevMix = () => {
        setCurrentIndex((prev) => (prev - 1 + featuredMixes.length) % featuredMixes.length);
    };

    if (isLoading) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
                        <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <div className="aspect-video bg-muted rounded-lg animate-pulse"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (featuredMixes.length === 0) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Mixes</h2>
                    <div className="bg-muted rounded-lg p-12 max-w-4xl mx-auto">
                        <div className="text-muted-foreground">
                            <div className="text-6xl mb-4">🎵</div>
                            <p className="text-lg">Featured mixes coming soon!</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const currentMix = featuredMixes[currentIndex];
    const embedUrl = getEmbedUrl(currentMix);

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Mixes</h2>
                    <p className="text-muted-foreground text-lg">
                        Listen to some of my latest and greatest sets
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Current Mix Display */}
                    <div className="relative">
                        <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-semibold mb-2">{currentMix.title}</h3>
                                <p className="text-muted-foreground capitalize">
                                    {currentMix.platform}
                                </p>
                            </div>

                            {embedUrl ? (
                                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                    <iframe
                                        src={embedUrl}
                                        title={currentMix.title}
                                        className="w-full h-full"
                                        frameBorder="0"
                                        allow="autoplay"
                                        allowFullScreen
                                    />
                                </div>
                            ) : (
                                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                                    <div className="text-center text-muted-foreground">
                                        <div className="text-4xl mb-4">🎵</div>
                                        <p>Unable to embed this mix</p>
                                        <a
                                            href={currentMix.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline mt-2 inline-block"
                                        >
                                            Listen on {currentMix.platform}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation Arrows */}
                        {featuredMixes.length > 1 && (
                            <>
                                <button
                                    onClick={prevMix}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border border-border rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                                    aria-label="Previous mix"
                                >
                                    <span className="text-xl">←</span>
                                </button>
                                <button
                                    onClick={nextMix}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border border-border rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                                    aria-label="Next mix"
                                >
                                    <span className="text-xl">→</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Dots Indicator */}
                    {featuredMixes.length > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            {featuredMixes.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentIndex
                                        ? 'bg-primary scale-125'
                                        : 'bg-muted hover:bg-muted-foreground/50'
                                        }`}
                                    aria-label={`Go to mix ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Mix Counter */}
                    {featuredMixes.length > 1 && (
                        <div className="text-center mt-4">
                            <p className="text-sm text-muted-foreground">
                                {currentIndex + 1} of {featuredMixes.length}
                            </p>
                        </div>
                    )}
                </div>

                {/* View All Mixes Link */}
                <div className="text-center mt-12">
                    <a
                        href="/media"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                    >
                        View All Mixes
                        <span>→</span>
                    </a>
                </div>
            </div>
        </section>
    );
}