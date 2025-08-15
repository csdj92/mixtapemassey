'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MediaPhoto } from '@/types';
import { Download, X, ImageIcon } from 'lucide-react';

interface PressPhotosSectionProps {
    photos: MediaPhoto[];
}

export default function PressPhotosSection({ photos }: PressPhotosSectionProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<MediaPhoto | null>(null);
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

    const handleImageError = (photoId: string) => {
        setImageErrors(prev => new Set(prev).add(photoId));
    };

    if (!photos || photos.length === 0) {
        return (
            <section className="mb-16">
                <div className="bg-card rounded-lg p-8 shadow-sm border">
                    <h2 className="text-3xl font-bold text-foreground mb-6">
                        Press Photos
                    </h2>
                    <p className="text-muted-foreground">
                        Press photos will be available soon.
                    </p>
                </div>
            </section>
        );
    }

    const handleDownload = async (photo: MediaPhoto) => {
        try {
            const response = await fetch(photo.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `press-photo-${photo.id}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading photo:', error);
            // Fallback: open in new tab
            window.open(photo.url, '_blank');
        }
    };

    return (
        <>
            <section className="mb-16">
                <div className="bg-card rounded-lg p-8 shadow-sm border">
                    <h2 className="text-3xl font-bold text-foreground mb-6">
                        Press Photos
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        High-resolution photos available for download. Click on any image to view full size.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {photos.map((photo) => (
                            <div
                                key={photo.id}
                                className="group relative bg-muted rounded-lg overflow-hidden aspect-square cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => setSelectedPhoto(photo)}
                            >
                                {imageErrors.has(photo.id) ? (
                                    <div className="w-full h-full flex items-center justify-center bg-muted">
                                        <div className="text-center">
                                            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                                            <p className="text-sm text-muted-foreground">Image unavailable</p>
                                        </div>
                                    </div>
                                ) : (
                                    <Image
                                        src={photo.url}
                                        alt={photo.alt_text || 'Press photo'}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        onError={() => handleImageError(photo.id)}
                                    />
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownload(photo);
                                    }}
                                    className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    title="Download photo"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lightbox Modal */}
            {selectedPhoto && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl max-h-full">
                        <button
                            onClick={() => setSelectedPhoto(null)}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <div className="relative bg-white rounded-lg overflow-hidden">
                            {imageErrors.has(selectedPhoto.id) ? (
                                <div className="w-full h-96 flex items-center justify-center bg-muted">
                                    <div className="text-center">
                                        <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground">Image unavailable</p>
                                    </div>
                                </div>
                            ) : (
                                <Image
                                    src={selectedPhoto.url}
                                    alt={selectedPhoto.alt_text || 'Press photo'}
                                    width={800}
                                    height={600}
                                    className="max-w-full max-h-[80vh] object-contain"
                                    onError={() => handleImageError(selectedPhoto.id)}
                                />
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm">
                                        {selectedPhoto.alt_text || 'Press photo'}
                                    </p>
                                    <button
                                        onClick={() => handleDownload(selectedPhoto)}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}