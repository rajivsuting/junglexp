import { HeroOverlay } from './hero-overlay';
import { ImageCarousel } from './image-carousel';

interface HeroSectionProps {
  images: string[];
  activityName: string;
  location: string;
  difficulty: string;
  duration: string;
  rating: number;
  reviewCount: number;
  autoPlay?: boolean;
  interval?: number;
}

export function HeroSection({
  images,
  activityName,
  location,
  difficulty,
  duration,
  rating,
  reviewCount,
  autoPlay = true,
  interval = 2000, // 32 seconds
}: HeroSectionProps) {
  return (
    <div className="relative h-[90vh] overflow-hidden">
      <ImageCarousel
        images={images}
        alt={activityName}
        autoPlay={autoPlay}
        interval={interval}
      />
      <HeroOverlay
        activityName={activityName}
        location={location}
        difficulty={difficulty}
        duration={duration}
        rating={rating}
        reviewCount={reviewCount}
      />
    </div>
  );
}
