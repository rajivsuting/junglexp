import { FAQSection } from '@/components/faq-section';
import ReviewsSection from '@/components/ReviewsSection';

import { ActivityAmenitiesSection } from './components/activity-amenities-section';
import { ActivityImageGallery } from './components/activity-image-gallery';
import { ActivityItinerarySection } from './components/activity-itinerary-section';
import { ActivityPackagesSection } from './components/activity-packages-section';
import { ActivityPoliciesSection } from './components/activity-policies-section';
import { ActivityTitleSection } from './components/activity-title-section';
import {
    ActivityBookingCardDesktop
} from './components/booking-card/activity-booking-card-desktop';
import { ActivityBookingCardMobile } from './components/booking-card/activity-booking-card-mobile';

import type {
  TActivityAmenity,
  TActivityImage,
  TActivityItineraryBase,
  TActivityPolicy,
} from "@repo/db/index";

// Define a more flexible type for the activity data we receive
type ActivityData = {
  id: number;
  name: string;
  description: string;
  rating?: number | null;
  duration?: string | null;
  difficulty?: string | null;
  max_group_size?: number | null;
  images: TActivityImage[];
  zone?: {
    name: string;
    park?: {
      name: string;
      city?: {
        name: string;
        state?: {
          name: string;
        };
      };
    };
  };
  amenities: TActivityAmenity[];
  policies: TActivityPolicy[];
  itinerary: TActivityItineraryBase[];
  packages: Array<{
    id: number;
    name: string;
    description?: string | null;
    price: number;
    duration?: string | null;
    max_participants?: number | null;
    highlights?: string[];
    included_items?: string[];
    is_popular?: boolean;
  }>;
  faqs?: Array<{
    faq: {
      question: string;
      answer: string;
    };
  }>;
};

interface ActivityDetailsProps {
  activity: ActivityData;
}

const getInclusions = (activity: ActivityData) => {
  const included: TActivityPolicy[] = [];
  const excluded: TActivityPolicy[] = [];
  for (const policy of activity.policies) {
    if (policy.policy?.kind === "include") {
      included.push(policy);
    } else {
      excluded.push(policy);
    }
  }

  return { included, excluded };
};

export default function ActivityDetails(props: ActivityDetailsProps) {
  const { activity } = props;

  const {
    name,
    description,
    amenities,
    images,
    zone,
    rating,
    itinerary,
    packages,
    duration,
    difficulty,
    max_group_size,
  } = activity;

  const { included, excluded } = getInclusions(activity);

  // Get base price from the first package or default
  const basePrice = packages?.[0]?.price || 1000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title Section */}
      <ActivityTitleSection
        name={name}
        rating={rating}
        zone={zone!}
        duration={duration}
        difficulty={difficulty}
        maxGroupSize={max_group_size}
      />

      {/* Image Gallery */}
      <ActivityImageGallery images={images} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Description */}
          <section className="pb-6 border-b border-border">
            <p className="text-primary whitespace-pre-line leading-relaxed">
              {description}
            </p>
          </section>

          {/* Packages Section - Key feature for activities */}
          <ActivityPackagesSection packages={packages} />

          {/* Itinerary Section - Key feature for activities */}
          <ActivityItinerarySection itinerary={itinerary as any} />

          {/* What's Included Section */}
          <ActivityPoliciesSection policies={included as any} kind="include" />

          {/* What's Not Included Section */}
          <ActivityPoliciesSection policies={excluded as any} kind="exclude" />

          {/* Amenities */}
          <ActivityAmenitiesSection amenities={amenities as any} />

          <FAQSection
            faqs={activity.faqs?.map((item) => item.faq) || ([] as any)}
          />
        </div>

        {/* Booking Card - Desktop Only */}
        <ActivityBookingCardDesktop
          packages={packages}
          basePrice={basePrice}
          rating={rating || 0}
          duration={duration}
          maxGroupSize={max_group_size}
        />
      </div>

      {/* Mobile/Tablet Fixed Bottom Button */}
      <ActivityBookingCardMobile
        packages={packages}
        basePrice={basePrice}
        rating={rating || 0}
      />

      <ReviewsSection className="pt-16 pb-20 lg:pb-16" />
    </div>
  );
}
