import { Card, CardContent } from '@/components/ui/card';

function ExploreIcon() {
  // Placeholder SVG for 'Explore Effortlessly'
  return (
    <svg
      width="340"
      height="280"
      viewBox="0 0 140 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="14" y="41" width="112" height="56" rx="12" fill="#FFEFC7" />
      <path
        d="M42 84 L70 50 L98 84 Z"
        fill="#fff"
        stroke="#222"
        strokeWidth="3"
      />
      <circle cx="70" cy="62" r="8" fill="#6EE7B7" />
      <rect
        x="56"
        y="77"
        width="28"
        height="14"
        rx="3"
        fill="#fff"
        stroke="#222"
        strokeWidth="3"
      />
      <path
        d="M28 70 Q70 28 112 70"
        stroke="#222"
        strokeWidth="3"
        fill="none"
      />
      <circle cx="35" cy="70" r="5" fill="#FACC15" />
    </svg>
  );
}

function PlanIcon() {
  // Placeholder SVG for 'Plan Seamlessly'
  return (
    <svg
      width="340"
      height="280"
      viewBox="0 0 140 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="14" y="41" width="112" height="56" rx="12" fill="#FFF7E6" />
      <rect
        x="49"
        y="70"
        width="42"
        height="14"
        rx="3"
        fill="#fff"
        stroke="#222"
        strokeWidth="3"
      />
      <rect x="98" y="56" width="21" height="14" rx="3" fill="#6EE7B7" />
      <circle cx="70" cy="62" r="8" fill="#FACC15" />
      <path d="M70 50 L70 35" stroke="#222" strokeWidth="3" />
      <rect
        x="63"
        y="28"
        width="14"
        height="11"
        rx="3"
        fill="#fff"
        stroke="#222"
        strokeWidth="3"
      />
      <rect
        x="112"
        y="84"
        width="14"
        height="7"
        rx="3"
        fill="#fff"
        stroke="#222"
        strokeWidth="3"
      />
    </svg>
  );
}

function BookIcon() {
  // Placeholder SVG for 'Book Confidently'
  return (
    <svg
      width="340"
      height="280"
      viewBox="0 0 140 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="14" y="41" width="112" height="56" rx="12" fill="#E6F9F7" />
      <rect
        x="42"
        y="70"
        width="56"
        height="21"
        rx="4"
        fill="#fff"
        stroke="#222"
        strokeWidth="3"
      />
      <rect x="49" y="77" width="14" height="7" rx="2" fill="#FACC15" />
      <rect x="77" y="77" width="14" height="7" rx="2" fill="#6EE7B7" />
      <rect
        x="98"
        y="56"
        width="14"
        height="11"
        rx="3"
        fill="#fff"
        stroke="#222"
        strokeWidth="3"
      />
      <circle cx="126" cy="56" r="8" fill="#6EE7B7" />
      <rect
        x="119"
        y="49"
        width="14"
        height="7"
        rx="3"
        fill="#fff"
        stroke="#222"
        strokeWidth="3"
      />
    </svg>
  );
}

export function FeatureStepsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="flex justify-center mb-4">
              <ExploreIcon />
            </div>
            <h3 className="text-2xl font-bold mb-2">Explore Effortlessly</h3>
            <p className="text-muted-foreground">
              Find the perfect stay in Jim Corbett from a curated list of
              resorts, hotels, and unique accommodations.
            </p>
          </div>
          <div>
            <div className="flex justify-center mb-4">
              <PlanIcon />
            </div>
            <h3 className="text-2xl font-bold mb-2">Plan Seamlessly</h3>
            <p className="text-muted-foreground">
              Discover activities, events, and safari adventures to make your
              Corbett trip unforgettable.
            </p>
          </div>
          <div>
            <div className="flex justify-center mb-4">
              <BookIcon />
            </div>
            <h3 className="text-2xl font-bold mb-2">Book Confidently</h3>
            <p className="text-muted-foreground">
              Enjoy the best deals and reliable service with easy booking for
              all your travel needs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
