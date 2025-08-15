'use client';

import { useState } from 'react';

interface VideoPlayerProps {
    videoUrl?: string;
    title?: string;
    className?: string;
}

export function VideoPlayer({ videoUrl, title = "Promo Reel", className = "" }: VideoPlayerProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Extract video ID and platform from URL
    const getVideoEmbedData = (url: string) => {
        // YouTube patterns
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const youtubeMatch = url.match(youtubeRegex);

        if (youtubeMatch) {
            return {
                platform: 'youtube',
                id: youtubeMatch[1],
                embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0&modestbranding=1&showinfo=0`
            };
        }

        // Vimeo patterns
        const vimeoRegex = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/;
        const vimeoMatch = url.match(vimeoRegex);

        if (vimeoMatch) {
            return {
                platform: 'vimeo',
                id: vimeoMatch[1],
                embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0&portrait=0`
            };
        }

        return null;
    };

    if (!videoUrl) {
        return (
            <section className={`py-16 ${className}`}>
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Promo Reel</h2>
                    <div className="bg-muted rounded-lg p-12 max-w-4xl mx-auto">
                        <div className="text-muted-foreground">
                            <div className="text-6xl mb-4">🎥</div>
                            <p className="text-lg">Promo video coming soon!</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const videoData = getVideoEmbedData(videoUrl);

    if (!videoData) {
        return (
            <section className={`py-16 ${className}`}>
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Promo Reel</h2>
                    <div className="bg-muted rounded-lg p-12 max-w-4xl mx-auto">
                        <div className="text-muted-foreground">
                            <div className="text-6xl mb-4">⚠️</div>
                            <p className="text-lg">Invalid video URL format</p>
                            <p className="text-sm mt-2">Please provide a valid YouTube or Vimeo URL</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={`py-16 ${className}`}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
                    <p className="text-muted-foreground text-lg">
                        Get a taste of the energy and experience
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
                                <div className="text-center">
                                    <div className="text-4xl mb-4">🎥</div>
                                    <p className="text-muted-foreground">Loading video...</p>
                                </div>
                            </div>
                        )}

                        {hasError && (
                            <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                <div className="text-center">
                                    <div className="text-4xl mb-4">❌</div>
                                    <p className="text-muted-foreground">Failed to load video</p>
                                </div>
                            </div>
                        )}

                        <iframe
                            src={videoData.embedUrl}
                            title={title}
                            className="absolute inset-0 w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            onLoad={() => setIsLoading(false)}
                            onError={() => {
                                setIsLoading(false);
                                setHasError(true);
                            }}
                        />
                    </div>

                    {/* Video Info */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Watch on {videoData.platform === 'youtube' ? 'YouTube' : 'Vimeo'}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}