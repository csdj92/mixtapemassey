'use client';

import { useEffect, useState } from 'react';
import type { MediaPhoto } from '@/types';

interface LightboxProps {
    photos: MediaPhoto[];
    currentIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

export function Lightbox({ photos, currentIndex, onClose, onNext, onPrev }: LightboxProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const currentPhoto = photos[currentIndex];

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowLeft':
                    onPrev();
                    break;
                case 'ArrowRight':
                    onNext();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onNext, onPrev]);

    // Prevent body scroll when lightbox is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Reset loading state when photo changes
    useEffect(() => {
        setIsLoaded(false);
        setHasError(false);
    }, [currentIndex]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-200"
                aria-label="Close lightbox"
            >
                <span className="text-xl">✕</span>
            </button>

            {/* Navigation Buttons */}
            {photos.length > 1 && (
                <>
                    <button
                        onClick={onPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
                        aria-label="Previous photo"
                    >
                        <span className="text-xl">←</span>
                    </button>
                    <button
                        onClick={onNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
                        aria-label="Next photo"
                    >
                        <span className="text-xl">→</span>
                    </button>
                </>
            )}

            {/* Photo Container */}
            <div className="relative max-w-full max-h-full flex items-center justify-center">
                {hasError ? (
                    <div className="text-center text-white">
                        <div className="text-6xl mb-4">⚠️</div>
                        <p className="text-lg">Failed to load image</p>
                    </div>
                ) : (
                    <div className="relative">
                        {!isLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            </div>
                        )}
                        <img
                            src={currentPhoto.url}
                            alt={currentPhoto.alt_text || 'Photo'}
                            className={`max-w-full max-h-[90vh] object-contain transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                            onLoad={() => setIsLoaded(true)}
                            onError={() => setHasError(true)}
                        />
                    </div>
                )}
            </div>

            {/* Photo Info */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white">
                <div className="bg-black/50 rounded-lg px-4 py-2 backdrop-blur-sm">
                    {currentPhoto.alt_text && (
                        <p className="text-sm mb-1">{currentPhoto.alt_text}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-white/70">
                        <span>{currentIndex + 1} of {photos.length}</span>
                        {currentPhoto.is_press && (
                            <span className="bg-blue-500/20 px-2 py-1 rounded">Press Photo</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Thumbnail Strip (for larger screens) */}
            {photos.length > 1 && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 hidden md:flex gap-2 max-w-full overflow-x-auto px-4">
                    {photos.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((photo, index) => {
                        const actualIndex = Math.max(0, currentIndex - 2) + index;
                        return (
                            <button
                                key={photo.id}
                                onClick={() => {
                                    // Calculate the actual index in the full array
                                    const targetIndex = actualIndex;
                                    if (targetIndex < currentIndex) {
                                        for (let i = 0; i < currentIndex - targetIndex; i++) {
                                            onPrev();
                                        }
                                    } else if (targetIndex > currentIndex) {
                                        for (let i = 0; i < targetIndex - currentIndex; i++) {
                                            onNext();
                                        }
                                    }
                                }}
                                className={`w-16 h-16 rounded overflow-hidden border-2 transition-all duration-200 ${actualIndex === currentIndex
                                        ? 'border-white scale-110'
                                        : 'border-white/30 hover:border-white/60'
                                    }`}
                            >
                                <img
                                    src={photo.url}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}