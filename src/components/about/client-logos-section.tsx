'use client';

import Image from 'next/image';
import { Building2 } from 'lucide-react';
import { useState } from 'react';

interface ClientLogosSectionProps {
    clientLogos: Array<{ name: string; url: string; alt?: string }>;
}

export default function ClientLogosSection({ clientLogos }: ClientLogosSectionProps) {
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

    const handleImageError = (clientName: string) => {
        setImageErrors(prev => new Set(prev).add(clientName));
    };
    if (!clientLogos || clientLogos.length === 0) {
        return (
            <section className="mb-16">
                <div className="bg-card rounded-lg p-8 shadow-sm border">
                    <h2 className="text-3xl font-bold text-foreground mb-6">
                        Past Clients
                    </h2>
                    <p className="text-muted-foreground">
                        Client logos will be available soon.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="mb-16">
            <div className="bg-card rounded-lg p-8 shadow-sm border">
                <h2 className="text-3xl font-bold text-foreground mb-6">
                    Past Clients
                </h2>
                <p className="text-muted-foreground mb-8">
                    Trusted by leading venues, corporations, and event organizers.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center">
                    {clientLogos.map((client, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
                        >
                            <div className="relative w-full h-16 grayscale group-hover:grayscale-0 transition-all duration-300">
                                {imageErrors.has(client.name) ? (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <Building2 className="w-8 h-8 text-muted-foreground mx-auto mb-1" />
                                            <p className="text-xs text-muted-foreground">{client.name}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <Image
                                        src={client.url}
                                        alt={client.alt || `${client.name} logo`}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                        onError={() => handleImageError(client.name)}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}