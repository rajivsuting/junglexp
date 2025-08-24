import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { getHotelsByParkId } from "@repo/actions/hotels.actions";

import type { TNationalPark } from "@repo/db/index";
export default async function LodgesSection({ park }: { park: TNationalPark }) {
  // Double the lodges for seamless infinite scroll

  const parkId = park.id;
  const parkIdNumber = Number(parkId);
  if (!parkIdNumber || isNaN(parkIdNumber)) {
    return null;
  }

  const hotels = await getHotelsByParkId(parkIdNumber, "resort");

  return (
    <section className="py-16 overflow-hidden">
      <div className="mx-auto">
        <h2 className="text-primary text-center text-3xl font-light mb-8">
          TOP RESORTS IN <span className="font-bold">{park.name}</span>
        </h2>

        <p className="text-center text-primary text-lg mb-16 max-w-4xl mx-auto">
          We've picked the Top Resorts in {park.name} Tour for you to choose
          from below so you can unwind while on vacation. These particular
          resorts are highly regarded for their features, services, cuisine,
          activities, and other aspect.
        </p>

        <div className="relative w-full overflow-hidden">
          <div
            className="flex gap-4 animate-[scroll_40s_linear_infinite] hover:[animation-play-state:paused!important]"
            style={{ width: "max-content" }}
          >
            {hotels.map((hotel, index) => (
              <button
                key={`${hotel.name}-${index}`}
                className="group w-[calc(100vw_-_32px)] md:w-[550px] cursor-pointer flex-shrink-0"
                tabIndex={0}
              >
                <div
                  className={cn(
                    "relative aspect-video w-full overflow-hidden",
                    hotel.images[0]?.image?.original_url
                      ? ""
                      : "flex items-center justify-center"
                  )}
                >
                  {!hotel.images[0]?.image?.original_url ? (
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  ) : (
                    <Image
                      src={hotel.images[0]?.image?.original_url}
                      alt={hotel.name + " images"}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  )}
                  <div className="'absolute inset-0 bg-[#3c553d50]" />
                </div>
                <h3 className="text-sm py-3 bg-dark-corvid text-white text-center">
                  {hotel.name}
                </h3>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            href={`/parks/${park.slug}/stays/hotels`}
            className="px-8 py-3 bg-[#2F2F2F] text-white hover:bg-[#444444] transition-colors"
          >
            ALL LODGES
          </Link>
        </div>
      </div>
    </section>
  );
}
