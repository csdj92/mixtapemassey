interface GenresSectionProps {
    genres: string[];
}

export default function GenresSection({ genres }: GenresSectionProps) {
    if (!genres || genres.length === 0) {
        return (
            <section className="mb-16">
                <div className="bg-card rounded-lg p-8 shadow-sm border">
                    <h2 className="text-3xl font-bold text-foreground mb-6">
                        Music Genres
                    </h2>
                    <p className="text-muted-foreground">
                        Genre information will be available soon.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="mb-16">
            <div className="bg-card rounded-lg p-8 shadow-sm border">
                <h2 className="text-3xl font-bold text-foreground mb-6">
                    Music Genres
                </h2>
                <p className="text-muted-foreground mb-8">
                    Specializing in a diverse range of musical styles to suit any event or audience.
                </p>

                <div className="flex flex-wrap gap-3">
                    {genres.map((genre, index) => (
                        <span
                            key={index}
                            className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20 hover:bg-primary/20 transition-colors"
                        >
                            {genre}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}