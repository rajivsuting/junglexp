"use client";

import { DynamicIcon } from 'lucide-react/dynamic';

import type { FC } from "react";
import type { IconName } from "lucide-react/dynamic";

import type { TRoom } from "@repo/db/schema/types";

type RoomAmenitiesSectionProps = Pick<TRoom, "amenities"> & {
  title?: string;
  className?: string;
  maxItems?: number;
};

export const RoomAmenitiesSection: FC<RoomAmenitiesSectionProps> = (props) => {
  const { amenities, title, className = "", maxItems } = props;

  if (!amenities || amenities.length === 0) return null;

  return (
    <section className={className}>
      {title ? <h4 className="text-sm font-semibold mb-2">{title}</h4> : null}
      <div className="grid grid-cols-1 gap-2">
        {amenities.map(({ amenity }) => (
          <div key={amenity.id} className="flex items-center gap-2">
            <DynamicIcon name={amenity.icon as IconName} className="w-4 h-4" />
            <span className="text-sm">{amenity.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
