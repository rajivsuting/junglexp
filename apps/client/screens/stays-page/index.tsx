import { Suspense } from 'react';

import { FAQSection } from '@/components/faq-section';
import ReviewsSection from '@/components/ReviewsSection';

import { BookingCardDesktop } from './components/booking-card/booking-card-desktop';
import { BookingCardMobile } from './components/booking-card/booking-cark-mobile';
import NearbySection from './components/nearby-section';
import { RoomsSection } from './components/rooms-section';
import { StayAmenitiesSection } from './components/stay-amenities-section';
import { StayImageGallery } from './components/stay-image-gallery';
import { StayPoliciesSection } from './components/stay-policies-section';
import { StaySaftyFeatures } from './components/stay-safty-features';
import { StayTitleSection } from './components/stay-title-section';

import type { THotel, THotelPolicy } from "@repo/db/index";
interface StayDetailsProps {
  stay: THotel;
  title: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  amenities: string[];
  included: string[];
  excluded: string[];
  safetyFeatures: string[];
  host: {
    name: string;
    image: string;
    joinedDate: string;
    isSuperhost: boolean;
    languages: string[];
    responseRate: number;
  };
  cancellationPolicy: string;
  houseRules: string[];
}

const getInclusions = (stay: THotel) => {
  const included: THotelPolicy[] = [];
  const excluded: THotelPolicy[] = [];
  for (const policy of stay.policies) {
    if (policy.policy?.kind === "include") {
      included.push(policy);
    } else {
      excluded.push(policy);
    }
  }

  return { included, excluded };
};

export default function StayDetails(props: Partial<StayDetailsProps>) {
  const stay = props.stay!;

  const { saftyFeatures, name, description, amenities, images, zone, rating } =
    stay;
  const { included, excluded } = getInclusions(stay);

  const price = stay.rooms[0]?.plans[0]?.price;

  return (
    <div className="max-w-7xl text-primary mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      {/* <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
        <span>Homes</span>
        <ChevronRight className="w-4 h-4" />
        <span>India</span>
        <ChevronRight className="w-4 h-4" />
        <span>Goa</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-primary">Candolim</span>
      </div> */}
      {/* Title Section */}
      <StayTitleSection name={name} rating={rating} zone={zone} />
      {/* Image Gallery */}
      <StayImageGallery images={images} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Host Info */}
          {/* <div className="flex items-center justify-between pb-6 border-b border-border">
            <div>
              <h2 className="text-xl font-semibold text-primary mb-2">
                Entire villa hosted by {host.name}
              </h2>
              <div className="flex items-center gap-4 text-muted-foreground text-sm">
                <span>8 guests</span>
                <span>•</span>
                <span>4 bedrooms</span>
                <span>•</span>
                <span>4 beds</span>
                <span>•</span>
                <span>3 baths</span>
              </div>
            </div>
            <div className="relative">
              <Image
                src={host.image || "/host-placeholder.jpg"}
                alt={host.name}
                width={56}
                height={56}
                className="rounded-full"
              />
              {host.isSuperhost && (
                <div className="absolute -bottom-1 -right-1 bg-accent rounded-full p-1">
                  <Award className="w-4 h-4 text-accent-foreground" />
                </div>
              )}
            </div>
          </div> */}

          {/* Description */}
          <section className="pb-6 border-b border-border">
            <p className="text-primary text-justify whitespace-pre-line leading-relaxed">
              {description}
            </p>
          </section>

          {/* What's Included Section */}
          {/* <StayPoliciesSection policies={included} kind="include" /> */}

          {/* What's Not Included Section */}
          {/* <StayPoliciesSection policies={excluded} kind="exclude" /> */}

          {/* Amenities */}
          <StayAmenitiesSection amenities={amenities} />

          {/* Safety Features */}
          <StaySaftyFeatures saftyFeatures={saftyFeatures} />

          {/* House Rules */}
          {/* <div className="py-6 border-b border-border">
            <h2 className="text-xl font-semibold text-primary mb-4">
              House rules
            </h2>
            <div className="space-y-3">
              {houseRules.map((rule, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-primary"
                >
                 
                  <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div> */}

          <FAQSection faqs={stay.faqs.map((item) => item.faq)} />
          <div className="md:hidden">
            <Suspense>
              <NearbySection
                redirectUrl={stay.redirect_url}
                url={stay.map_url}
                location={{
                  lon: stay.location.x,
                  lat: stay.location.y,
                }}
                hotelId={stay.id}
                hotelName={stay.name}
                city={stay.zone.park.city.name}
              />
            </Suspense>
          </div>
        </div>
        {/* Booking Card - Desktop Only */}
        {/* <BookingCardDesktop
          price={price || 0}
          originalPrice={price || 0}
          rating={rating || 0}
        /> */}
        <div>
          <div className="lg:col-span-1 hidden lg:block">
            <Suspense>
              <NearbySection
                redirectUrl={stay.redirect_url}
                url={stay.map_url}
                location={{
                  lon: stay.location.x,
                  lat: stay.location.y,
                }}
                hotelId={stay.id}
                hotelName={stay.name}
                city={stay.zone.park.city.name}
              />
            </Suspense>
          </div>
          {/* <BookingCardDesktop price={0} originalPrice={0} rating={0} /> */}
        </div>
      </div>
      {/* Rooms Section */}
      <RoomsSection stay={stay} />
      {/* Mobile/Tablet Fixed Bottom Button */}
      <BookingCardMobile
        price={price || 0}
        originalPrice={price || 0}
        rating={rating || 0}
      />

      <ReviewsSection className="pt-16 pb-20 lg:pb-16" />
    </div>
  );
}
