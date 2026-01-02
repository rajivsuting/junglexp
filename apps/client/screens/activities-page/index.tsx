import ReviewsSection from "@/components/ReviewsSection";

import { StayPoliciesSection } from "../stays-page/components/stay-policies-section";
import { ActivityImageGallery } from "./components/activity-image-gallery";
import { ActivityItinerarySection } from "./components/activity-itinerary-section";
import { ActivityPackagesSection } from "./components/activity-packages-section";
import { ActivityTitleSection } from "./components/activity-title-section";
import { ActivityBookingCardDesktop } from "./components/booking-card/activity-booking-card-desktop";
import { ActivityBookingCardMobile } from "./components/booking-card/activity-booking-card-mobile";

import type { TActivity, TActivityPolicy } from "@repo/db/index";
// Define a more flexible type for the activity data we receive

interface ActivityDetailsProps {
  activity: TActivity;
}

const getInclusions = (activity: TActivity) => {
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
    slug,
    description,
    amenities,
    images,
    itinerary,
    packages,
    park,
  } = activity;

  const { included, excluded } = getInclusions(activity);

  // Get base price from the first package or default
  const basePrice = packages?.[0]?.price || 1000;

  return (
    <div className="max-w-7xl text-primary mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title Section */}
      <ActivityTitleSection name={name} park={park} />

      {/* Image Gallery */}
      <ActivityImageGallery images={images} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Description */}
          <section className="pb-6 border-b border-border">
            <p className="text-primary text-justify whitespace-pre-line leading-relaxed">
              {description}
            </p>
          </section>

          {/* Packages Section - Key feature for activities */}
          <ActivityPackagesSection packages={packages} activity={activity} />

          {/* Itinerary Section - Key feature for activities */}
          <ActivityItinerarySection itinerary={itinerary as any} />

          {/* What's Included Section */}
          <StayPoliciesSection policies={included as any} kind="include" />

          {/* What's Not Included Section */}
          <StayPoliciesSection policies={excluded as any} kind="exclude" />

          {/* Amenities */}
          {/* <StayAmenitiesSection amenities={amenities as any} /> */}

          {/* <FAQSection
            faqs={activity.faqs?.map((item) => item.faq) || ([] as any)}
          /> */}
        </div>

        {/* Booking Card - Desktop Only */}
        <ActivityBookingCardDesktop packages={packages} basePrice={basePrice} />
      </div>

      {/* Mobile/Tablet Fixed Bottom Button */}
      <ActivityBookingCardMobile packages={packages} basePrice={basePrice} />

      <ReviewsSection className="pt-16 pb-20 lg:pb-16" />
    </div>
  );
}
