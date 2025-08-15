import { Metadata } from 'next';
import { getSettings, getPressPhotos } from '@/lib/database';
import AboutContent from '@/components/about/about-content';
import { MainLayout } from '@/components/layout';

export const metadata: Metadata = {
    title: 'About | EPK',
    description: 'Professional DJ bio, press materials, and electronic press kit',
};

export default async function AboutPage() {
    try {
        const [settings, pressPhotos] = await Promise.all([
            getSettings(),
            getPressPhotos()
        ]);

        return (
            <MainLayout>
                <AboutContent settings={settings} pressPhotos={pressPhotos} />
            </MainLayout>
        );
    } catch (error) {
        console.error('Error loading about page:', error);
        return (
            <MainLayout>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-foreground mb-4">
                            Unable to load content
                        </h1>
                        <p className="text-muted-foreground">
                            Please try again later or contact support.
                        </p>
                    </div>
                </div>
            </MainLayout>
        );
    }
}