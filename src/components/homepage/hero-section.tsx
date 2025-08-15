'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Music } from 'lucide-react';
import { getSettings } from '@/lib/database';
import type { Settings } from '@/types';

interface HeroSectionProps {
    settings?: Settings | undefined;
}

export function HeroSection({ settings }: HeroSectionProps) {
    const [isLoading, setIsLoading] = useState(!settings);
    const [heroData, setHeroData] = useState<Settings | null>(settings || null);

    useEffect(() => {
        if (!settings) {
            const fetchSettings = async () => {
                try {
                    const data = await getSettings();
                    setHeroData(data);
                } catch (error) {
                    console.error('Failed to fetch settings:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchSettings();
        }
    }, [settings]);

    if (isLoading) {
        return (
            <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-background to-muted">
                <div className="animate-pulse text-center">
                    <div className="h-12 bg-muted rounded w-64 mx-auto mb-4"></div>
                    <div className="h-6 bg-muted rounded w-96 mx-auto mb-8"></div>
                    <div className="flex gap-4 justify-center">
                        <div className="h-12 bg-muted rounded w-32"></div>
                        <div className="h-12 bg-muted rounded w-40"></div>
                    </div>
                </div>
            </section>
        );
    }

    const defaultHeading = "Professional DJ Services";
    const defaultSubheading = "Creating unforgettable experiences through music";

    return (
        <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-background to-muted">
            {/* Background overlay for better text readability */}
            <div className="absolute inset-0 bg-black/20"></div>

            <div className="relative z-10 container mx-auto px-4 text-center">
                {/* Logo */}
                {heroData?.logo_url && (
                    <div className="mb-8">
                        <Image
                            src={heroData.logo_url}
                            alt={heroData.site_title || "DJ Logo"}
                            width={96}
                            height={96}
                            className="h-24 w-auto mx-auto object-contain"
                        />
                    </div>
                )}

                {/* Hero Heading */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    {heroData?.hero_heading || defaultHeading}
                </h1>

                {/* Hero Subheading */}
                <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                    {heroData?.hero_sub || defaultSubheading}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/book"
                        className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[160px]"
                    >
                        Book Now
                    </Link>
                    <Link
                        href="/song-request"
                        className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary hover:text-primary-foreground transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[160px]"
                    >
                        Request a Song
                    </Link>
                </div>

                {/* Social Media Links */}
                {heroData?.socials && Object.keys(heroData.socials).length > 0 && (
                    <div className="mt-12 flex justify-center gap-6">
                        {Object.entries(heroData.socials).map(([platform, url]) => {
                            const getSocialIcon = (platform: string) => {
                                switch (platform.toLowerCase()) {
                                    case 'instagram':
                                        return <Instagram className="w-6 h-6" />;
                                    case 'soundcloud':
                                        return <Music className="w-6 h-6" />;
                                    case 'tiktok':
                                        return (
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                            </svg>
                                        );
                                    default:
                                        return <span className="capitalize text-sm">{platform}</span>;
                                }
                            };

                            return (
                                <a
                                    key={platform}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-primary transition-colors duration-200 p-2 rounded-full hover:bg-muted/50"
                                    aria-label={`Follow on ${platform}`}
                                >
                                    {getSocialIcon(platform)}
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}