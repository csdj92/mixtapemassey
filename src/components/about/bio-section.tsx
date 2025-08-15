interface BioSectionProps {
    bio: string | null;
}

export default function BioSection({ bio }: BioSectionProps) {
    if (!bio) return null;

    return (
        <section className="mb-16">
            <div className="bg-card rounded-lg p-8 shadow-sm border">
                <h2 className="text-3xl font-bold text-foreground mb-6">
                    Professional Bio
                </h2>
                <div className="prose prose-lg max-w-none dark:prose-invert">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {bio}
                    </p>
                </div>
            </div>
        </section>
    );
}