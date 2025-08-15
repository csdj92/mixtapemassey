'use client';

import { useState, useRef, useEffect } from 'react';
import type { Mix } from '@/types';

interface MixEmbedProps {
    mix: Mix;
}

export function MixEmbed({ mix }: MixEmbedProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const embedRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        if (embedRef.current) {
            observer.observe(embedRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const getEmbedUrl = (mix: Mix): string | null => {
        try {
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
        } catch (error) {
            console.error('Error parsing embed URL:', error);
        }
        return null;
    };

    const embedUrl = getEmbedUrl(mix);

    const handleIframeLoad = () => {
        setIsLoaded(true);
    };

    const handleIframeError = () => {
        setHasError(true);
        setIsLoaded(true);
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'soundcloud':
                return '🎵';
            case 'mixcloud':
                return '🎧';
            case 'youtube':
                return '📺';
            default:
                return '🎵';
        }
    };

    const getPlatformColor = (platform: string) => {
        switch (platform) {
            case 'soundcloud':
                return 'bg-orange-500';
            case 'mixcloud':
                return 'bg-blue-500';
            case 'youtube':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div ref={embedRef} className="bg-card rounded-lg border border-border overflow-hidden shadow-lg">
            {/* Mix Header */}
            <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-lg mb-1">{mix.title}</h3>
                        <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${getPlatformColor(mix.platform)}`}>
                                {getPlatformIcon(mix.platform)}
                                {mix.platform.charAt(0).toUpperCase() + mix.platform.slice(1)}
                            </span>
                            {mix.featured && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                                    ⭐ Featured
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Embed Container */}
            <div className="relative">
                {!isInView ? (
                    // Placeholder before lazy loading
                    <div className="aspect-video bg-muted flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                            <div className="text-4xl mb-2">{getPlatformIcon(mix.platform)}</div>
                            <p className="text-sm">Loading...</p>
                        </div>
                    </div>
                ) : hasError || !embedUrl ? (
                    // Error state
                    <div className="aspect-video bg-muted flex items-center justify-center">
                        <div className="text-center text-muted-foreground p-6">
                            <div className="text-4xl mb-4">⚠️</div>
                            <p className="text-sm mb-4">Unable to embed this mix</p>
                            <a
                                href={mix.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                            >
                                Listen on {mix.platform}
                                <span>↗</span>
                            </a>
                        </div>
                    </div>
                ) : (
                    // Embed iframe
                    <div className="aspect-video bg-black relative">
                        {!isLoaded && (
                            <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                                <div className="text-center text-muted-foreground">
                                    <div className="text-4xl mb-2">{getPlatformIcon(mix.platform)}</div>
                                    <p className="text-sm">Loading embed...</p>
                                </div>
                            </div>
                        )}
                        <iframe
                            src={embedUrl}
                            title={mix.title}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="autoplay"
                            allowFullScreen
                            onLoad={handleIframeLoad}
                            onError={handleIframeError}
                            loading="lazy"
                        />
                    </div>
                )}
            </div>

            {/* Mix Footer */}
            <div className="p-4 bg-muted/50">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Added {new Date(mix.created_at).toLocaleDateString()}</span>
                    <a
                        href={mix.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                    >
                        View Original ↗
                    </a>
                </div>
            </div>
        </div>
    );
}