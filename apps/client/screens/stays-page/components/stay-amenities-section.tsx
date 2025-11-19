import { DynamicIcon } from 'lucide-react/dynamic';

import type { FC } from "react";
import type { THotel } from "@repo/db/index";
import type { IconName } from "lucide-react/dynamic";

type StayAmenitiesSectionProps = Pick<THotel, "amenities">;

export const StayAmenitiesSection: FC<StayAmenitiesSectionProps> = (props) => {
  const { amenities } = props;

  return (
    <section className="py-6 border-b border-border">
      <h2 className="text-xl font-semibold text-primary">
        What this place offers
      </h2>

      <div
        className={"grid grid-cols-1 md:grid-cols-2 gap-3 transition-all pt-4"}
      >
        {amenities.map(({ amenity }) => (
          <div
            key={amenity.id}
            className="flex items-center gap-3 text-primary py-2"
          >
            <div className="text-muted-foreground">
              <DynamicIcon name={amenity.icon as IconName} size={14} />
            </div>
            {amenity.label}
          </div>
        ))}
      </div>
    </section>
  );
};
