import { MainLayout } from '@/components/layout';
import {
  HeroSection,
  UpcomingEvents,
  VideoPlayer,
  FeaturedMixes
} from '@/components/homepage';
import { getSettings, getUpcomingEvents, getFeaturedMixes } from '@/lib/database';

// This is a server component that fetches data at build time
export default async function Home() {
  // Fetch data in parallel for better performance
  const [settings, upcomingEvents, featuredMixes] = await Promise.allSettled([
    getSettings(),
    getUpcomingEvents(3),
    getFeaturedMixes()
  ]);

  // Extract successful results, fallback to undefined for errors
  const settingsData = settings.status === 'fulfilled' ? settings.value : undefined;
  const eventsData = upcomingEvents.status === 'fulfilled' ? upcomingEvents.value : undefined;
  const mixesData = featuredMixes.status === 'fulfilled' ? featuredMixes.value : undefined;

  // Get promo video URL from settings
  const promoVideoUrl = settingsData?.socials?.['promo_video'] || settingsData?.socials?.['youtube'];

  return (
    <MainLayout>
      {/* Hero Section */}
      <HeroSection settings={settingsData} />

      {/* Upcoming Events */}
      <UpcomingEvents events={eventsData} limit={3} />

      {/* Promo Video */}
      {promoVideoUrl && (
        <VideoPlayer
          videoUrl={promoVideoUrl}
          title="Promo Reel"
          className="bg-background"
        />
      )}

      {/* Featured Mixes */}
      <FeaturedMixes mixes={mixesData} />
    </MainLayout>
  );
}
