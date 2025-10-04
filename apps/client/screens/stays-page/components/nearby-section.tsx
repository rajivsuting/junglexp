import { Car, Footprints, Plane } from 'lucide-react';

import { getNearbyPlacesToHotel } from '@repo/actions/hotels.actions';

import BookNowButton from './book-now-button';
import NearbyMap from './nearby-map';

type NearbySectionProps = {
  hotelId: number;
  hotelName: string;
  city: string;
};

const formatDuration = (meters: number) => {
  // Rough estimate: walk 80 m/min, drive 500 m/min
  if (meters <= 1200) {
    const mins = Math.max(1, Math.ceil(meters / 80));
    return { text: `${mins} min walk`, mode: "walk" as const };
  }
  const mins = Math.max(1, Math.ceil(meters / 500));
  return { text: `${mins} min drive`, mode: "drive" as const };
};

const iconFor = (name: string, mode: "walk" | "drive") => {
  const lower = name.toLowerCase();
  if (lower.includes("airport") || lower.includes("intl")) {
    return <Plane className="w-5 h-5 text-primary" />;
  }
  if (mode === "walk") return <Footprints className="w-5 h-5 text-primary" />;
  return <Car className="w-5 h-5 text-primary" />;
};

const NearbySection = async ({
  hotelId,
  hotelName,
  city,
}: NearbySectionProps) => {
  const places = await getNearbyPlacesToHotel(hotelId);

  const topPlaces = places.slice(0, 4);

  return (
    <section className="pt-12 md:pt-0">
      {/* Book now button scrolls to rooms */}
      <BookNowButton />
      <h2 className="text-2xl md:text-base font-semibold text-primary mb-4">
        Explore the area
      </h2>
      {/* Map embed with selectable nearby places */}
      <NearbyMap hotelName={hotelName} city={city} places={places as any} />

      {/* Nearby list */}
      <div className="mt-6 space-y-5">
        {topPlaces.map((p: any) => {
          const duration = formatDuration(Number(p.distance_in_meters ?? 0));
          return (
            <div key={p.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-primary">
                {iconFor(p.name, duration.mode)}
                <span className="text-base">{p.name}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {duration.text}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default NearbySection;
