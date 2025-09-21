"use client";
import { ChevronRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type NearbyPlace = {
  id: number;
  name: string;
  lat?: number | null;
  lon?: number | null;
};

type NearbyMapProps = {
  hotelName: string;
  city: string;
  places: NearbyPlace[];
};

const buildEmbedSrc = (
  hotelName: string,
  city: string,
  selected?: { lat?: number | null; lon?: number | null }
) => {
  if (selected && selected.lat != null && selected.lon != null) {
    const q = `${selected.lat},${selected.lon}`;
    return `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=14&output=embed`;
  }
  const q = `${hotelName}, ${city}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=13&output=embed`;
};

export default function NearbyMap({ hotelName, city, places }: NearbyMapProps) {
  const src = buildEmbedSrc(hotelName, city);

  const mapQuery = encodeURIComponent(`${hotelName}, ${city}`);
  const mapsViewUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <div className="overflow-hidden border border-border">
      <div className="aspect-[16/9] bg-muted/30">
        <iframe
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
      </div>
      {/* Address and View in map */}
      <div className="p-4 flex flex-col items-start justify-between gap-4">
        <div className="flex items-start gap-2 text-primary">
          <div className="text-sm font-medium">
            {hotelName}, {city}
          </div>
        </div>
        <Link
          href={mapsViewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-accent inline-flex items-center gap-1 text-xs font-medium"
        >
          View in a map
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
