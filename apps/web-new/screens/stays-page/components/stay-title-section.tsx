import { MapPin, Share, Star } from 'lucide-react';

import type { THotel } from "@repo/db/index";

type StayTitleSectionProps = Pick<THotel, "name" | "rating" | "zone"> & {};

export const StayTitleSection = (props: StayTitleSectionProps) => {
  const { rating, name, zone } = props;

  return (
    <section className="mb-6">
      <h1 className="text-3xl text-[#2a2b20] font-bold mb-2">{name}</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-accent fill-current" />
          <span className="font-medium">{rating}</span>

          <span className="mx-2">•</span>
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className=" underline cursor-pointer">
            {zone.park.city.name}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 hover:text-accent transition-colors">
            <Share className="w-5 h-5" />
            <span className="underline">Share</span>
          </button>
        </div>
      </div>
    </section>
  );
};
