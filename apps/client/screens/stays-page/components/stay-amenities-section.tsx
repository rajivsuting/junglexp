"use client";
import { ChevronDown } from 'lucide-react';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import type { FC } from "react";
import type { THotel } from "@repo/db/index";
import type { IconName } from "lucide-react/dynamic";

type StayAmenitiesSectionProps = Pick<THotel, "amenities">;

export const StayAmenitiesSection: FC<StayAmenitiesSectionProps> = (props) => {
  const { amenities } = props;
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="py-6 border-b border-border">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <h2 className="text-xl font-semibold text-primary">
          What this place offers
        </h2>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 gap-3 transition-all",
          expanded ? "opacity-100 pt-4" : "max-h-0 opacity-0"
        )}
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
