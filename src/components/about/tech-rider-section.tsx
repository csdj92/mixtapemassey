'use client';

import { Download, FileText } from 'lucide-react';

interface TechRiderSectionProps {
    riderFileUrl: string | null;
}

export default function TechRiderSection({ riderFileUrl }: TechRiderSectionProps) {
    const handleDownload = () => {
        if (riderFileUrl) {
            window.open(riderFileUrl, '_blank');
        }
    };

    return (
        <section className="mb-16">
            <div className="bg-card rounded-lg p-8 shadow-sm border">
                <h2 className="text-3xl font-bold text-foreground mb-6">
                    Technical Requirements
                </h2>
                <p className="text-muted-foreground mb-8">
                    Download our comprehensive tech rider for detailed equipment and setup requirements.
                </p>

                {riderFileUrl ? (
                    <div className="flex items-center justify-between p-6 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-lg">
                                <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">
                                    Technical Rider
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Complete equipment and setup specifications
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleDownload}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md flex items-center gap-2 transition-colors font-medium"
                        >
                            <Download className="w-4 h-4" />
                            Download PDF
                        </button>
                    </div>
                ) : (
                    <div className="text-center p-8 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            Tech rider will be available soon. Please contact us for specific technical requirements.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}