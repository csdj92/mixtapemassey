import { ExternalLink, Music, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

interface SocialLinksSectionProps {
    socials: Record<string, string>;
}

const getSocialIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();

    switch (platformLower) {
        case 'soundcloud':
            return <Music className="w-5 h-5" />;
        case 'instagram':
            return <Instagram className="w-5 h-5" />;
        case 'twitter':
        case 'x':
            return <Twitter className="w-5 h-5" />;
        case 'facebook':
            return <Facebook className="w-5 h-5" />;
        case 'youtube':
            return <Youtube className="w-5 h-5" />;
        case 'tiktok':
            return <Music className="w-5 h-5" />;
        case 'mixcloud':
            return <Music className="w-5 h-5" />;
        default:
            return <ExternalLink className="w-5 h-5" />;
    }
};

const formatPlatformName = (platform: string) => {
    const platformLower = platform.toLowerCase();

    switch (platformLower) {
        case 'soundcloud':
            return 'SoundCloud';
        case 'instagram':
            return 'Instagram';
        case 'twitter':
            return 'Twitter';
        case 'x':
            return 'X (Twitter)';
        case 'facebook':
            return 'Facebook';
        case 'youtube':
            return 'YouTube';
        case 'tiktok':
            return 'TikTok';
        case 'mixcloud':
            return 'Mixcloud';
        default:
            return platform.charAt(0).toUpperCase() + platform.slice(1);
    }
};

export default function SocialLinksSection({ socials }: SocialLinksSectionProps) {
    const socialEntries = Object.entries(socials || {}).filter(([, url]) => url);

    if (socialEntries.length === 0) {
        return (
            <section className="mb-16">
                <div className="bg-card rounded-lg p-8 shadow-sm border">
                    <h2 className="text-3xl font-bold text-foreground mb-6">
                        Connect & Follow
                    </h2>
                    <p className="text-muted-foreground">
                        Social media links will be available soon.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="mb-16">
            <div className="bg-card rounded-lg p-8 shadow-sm border">
                <h2 className="text-3xl font-bold text-foreground mb-6">
                    Connect & Follow
                </h2>
                <p className="text-muted-foreground mb-8">
                    Stay connected and follow for the latest mixes, events, and updates.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {socialEntries.map(([platform, url]) => (
                        <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 bg-muted/50 hover:bg-muted rounded-lg transition-colors group"
                        >
                            <div className="text-primary group-hover:text-primary/80 transition-colors">
                                {getSocialIcon(platform)}
                            </div>
                            <div className="flex-1">
                                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                                    {formatPlatformName(platform)}
                                </span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}