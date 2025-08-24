import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { getHotelsByParkId } from "@repo/actions/hotels.actions";

import type { TNationalPark } from "@repo/db/index";
export default async function ForestStaysSection({
  park,
}: {
  park: TNationalPark;
}) {
  const forestStays = await getHotelsByParkId(park.id, "forest");
  return (
    <section className="py-16 overflow-hidden">
      <div className="mx-auto">
        <h2 className="text-primary text-center text-3xl font-light mb-8">
          TOP FOREST STAYS IN <span className="font-bold">{park.name}</span>
        </h2>

        <p className="text-center text-primary text-lg mb-16 max-w-4xl mx-auto">
          We've picked the Top Forest stays in {park.name} Tour for you to
          choose from below so you can unwind while on vacation. These
          particular resorts are highly regarded for their features, services,
          cuisine, activities, and other aspects.
        </p>

        <div className="relative w-full overflow-hidden">
          <div
            className="flex gap-4 animate-[scroll_40s_linear_infinite] hover:[animation-play-state:paused!important]"
            style={{ width: "max-content" }}
          >
            {forestStays.map((stay, index) => (
              <button
                key={`${stay.name}-${index}`}
                className="group w-[calc(100vw_-_32px)] md:w-[550px] cursor-pointer flex-shrink-0"
                tabIndex={0}
              >
                <div
                  className={cn(
                    "relative aspect-video w-full overflow-hidden",
                    stay.images[0]?.image?.original_url
                      ? ""
                      : "flex items-center justify-center"
                  )}
                >
                  {!stay.images[0]?.image?.original_url ? (
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  ) : (
                    <Image
                      src={stay.images[0]?.image?.original_url}
                      alt={stay.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  )}
                </div>
                <h3 className="text-sm py-3 bg-dark-corvid text-white text-center">
                  {stay.name}
                </h3>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            href={`/parks/${park.slug}/stays/forest`}
            className="px-8 py-3 bg-[#2F2F2F] text-white hover:bg-[#444444] transition-colors"
          >
            ALL FOREST STAYS
          </Link>
        </div>
      </div>
    </section>
  );
}
