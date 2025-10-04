import { MapPin, Star } from 'lucide-react';

import StayShare from './stay-share';

import type { THotel } from "@repo/db/index";
type StayTitleSectionProps = Pick<THotel, "name" | "rating" | "zone"> & {};

export const StayTitleSection = (props: StayTitleSectionProps) => {
  const { rating, name, zone } = props;
  const ratingValue = Math.max(0, Math.min(5, Math.floor(Number(rating) || 0)));

  return (
    <section className="mb-6">
      <h1 className="text-3xl font-bold mb-2">{name}</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1"
            aria-label={`Rating ${ratingValue} out of 5`}
          >
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className={
                  "w-5 h-5 " +
                  (idx < ratingValue
                    ? "text-accent fill-current"
                    : "text-muted-foreground")
                }
              />
            ))}
          </div>

          <span className="mx-2">•</span>
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className=" underline cursor-pointer">
            {zone.park.city.name}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <StayShare name={name} zone={zone} />
        </div>
      </div>
    </section>
  );
};
