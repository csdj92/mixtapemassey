'use client';

import { useState, useRef, useEffect } from 'react';
import { Lightbox } from './lightbox';
import type { MediaPhoto } from '@/types';

interface PhotoGalleryProps {
    photos: MediaPhoto[];
}

interface LazyImageProps {
    photo: MediaPhoto;
    onClick: () => void;
    className?: string;
}

function LazyImage({ photo, onClick, className }: LazyImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

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

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={imgRef}
            className={`relative overflow-hidden cursor-pointer group ${className}`}
            onClick={onClick}
        >
            {!isInView ? (
                // Placeholder before lazy loading
                <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
                    <div className="text-muted-foreground text-2xl">📷</div>
                </div>
            ) : hasError ? (
                // Error state
                <div className="w-full h-full bg-muted flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                        <div className="text-2xl mb-2">⚠️</div>
                        <p className="text-xs">Failed to load</p>
                    </div>
                </div>
            ) : (
                // Image
                <div className="relative w-full h-full">
                    {!isLoaded && (
                        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                            <div className="text-muted-foreground text-2xl">📷</div>
                        </div>
                    )}
                    <img
                        src={photo.url}
                        alt={photo.alt_text || 'Performance photo'}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onLoad={() => setIsLoaded(true)}
                        onError={() => setHasError(true)}
                        loading="lazy"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-2">
                            <span className="text-black text-xl">🔍</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
    const [filter, setFilter] = useState<'all' | 'press' | 'performance'>('all');

    const filteredPhotos = photos.filter(photo => {
        if (filter === 'all') return true;
        if (filter === 'press') return photo.is_press;
        if (filter === 'performance') return !photo.is_press;
        return true;
    });

    const filterCounts = {
        all: photos.length,
        press: photos.filter(p => p.is_press).length,
        performance: photos.filter(p => !p.is_press).length,
    };

    const openLightbox = (index: number) => {
        setSelectedPhotoIndex(index);
    };

    const closeLightbox = () => {
        setSelectedPhotoIndex(null);
    };

    const nextPhoto = () => {
        if (selectedPhotoIndex !== null) {
            setSelectedPhotoIndex((selectedPhotoIndex + 1) % filteredPhotos.length);
        }
    };

    const prevPhoto = () => {
        if (selectedPhotoIndex !== null) {
            setSelectedPhotoIndex((selectedPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
        }
    };

    if (photos.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="bg-muted rounded-lg p-12 max-w-md mx-auto">
                    <div className="text-6xl mb-4">📷</div>
                    <h3 className="text-xl font-semibold mb-2">No Photos Yet</h3>
                    <p className="text-muted-foreground">
                        Check back soon for performance photos!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Filter Buttons */}
            <div className="flex justify-center gap-2 mb-8">
                {(['all', 'press', 'performance'] as const).map((filterType) => (
                    <button
                        key={filterType}
                        onClick={() => setFilter(filterType)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${filter === filterType
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted-foreground/20'
                            }`}
                        disabled={filterCounts[filterType] === 0}
                    >
                        {filterType === 'all' ? 'All Photos' :
                            filterType === 'press' ? 'Press Photos' : 'Performance Photos'}
                        {filterCounts[filterType] > 0 && (
                            <span className="ml-1">({filterCounts[filterType]})</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Photos Grid */}
            {filteredPhotos.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">
                        No photos found for this filter.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredPhotos.map((photo, index) => (
                        <LazyImage
                            key={photo.id}
                            photo={photo}
                            onClick={() => openLightbox(index)}
                            className="aspect-square rounded-lg overflow-hidden"
                        />
                    ))}
                </div>
            )}

            {/* Lightbox */}
            {selectedPhotoIndex !== null && (
                <Lightbox
                    photos={filteredPhotos}
                    currentIndex={selectedPhotoIndex}
                    onClose={closeLightbox}
                    onNext={nextPhoto}
                    onPrev={prevPhoto}
                />
            )}
        </div>
    );
}