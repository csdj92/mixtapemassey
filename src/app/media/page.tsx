import { Metadata } from 'next';
import { MediaPage } from '@/components/media/media-page';
import { MainLayout } from '@/components/layout';
import { getAllMixes, getMediaPhotos } from '@/lib/database';

export const metadata: Metadata = {
    title: 'Media | MixtapeMassey',
    description: 'Listen to featured mixes and view performance photos from MixtapeMassey',
    openGraph: {
        title: 'Media | MixtapeMassey',
        description: 'Listen to featured mixes and view performance photos from MixtapeMassey',
        type: 'website',
    },
};

export default async function Media() {
    try {
        const [mixes, photos] = await Promise.all([
            getAllMixes(),
            getMediaPhotos()
        ]);

        return (
            <MainLayout>
                <MediaPage mixes={mixes} photos={photos} />
            </MainLayout>
        );
    } catch (error) {
        console.error('Failed to fetch media data:', error);
        return (
            <MainLayout>
                <MediaPage mixes={[]} photos={[]} />
            </MainLayout>
        );
    }
}