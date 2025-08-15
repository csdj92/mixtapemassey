'use client';

import { Settings, MediaPhoto } from '@/types';
import BioSection from './bio-section';
import PressPhotosSection from './press-photos-section';
import GenresSection from './genres-section';
import ClientLogosSection from './client-logos-section';
import SocialLinksSection from './social-links-section';
import TechRiderSection from './tech-rider-section';

interface AboutContentProps {
    settings: Settings;
    pressPhotos: MediaPhoto[];
}

export default function AboutContent({ settings, pressPhotos }: AboutContentProps) {
    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Page Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                    About & EPK
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Professional DJ services with over a decade of experience creating unforgettable events
                </p>
            </div>

            {/* Bio Section */}
            <BioSection bio={settings.bio} />

            {/* Press Photos Section */}
            <PressPhotosSection photos={pressPhotos} />

            {/* Genres Section */}
            <GenresSection genres={settings.genres} />

            {/* Client Logos Section */}
            <ClientLogosSection clientLogos={settings.client_logos} />

            {/* Tech Rider Section */}
            <TechRiderSection riderFileUrl={settings.rider_file_url} />

            {/* Social Links Section */}
            <SocialLinksSection socials={settings.socials} />
        </div>
    );
}