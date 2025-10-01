import { Truck, Users, Waves } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getActivities, getActivitiesByParkSlug } from '@repo/actions/activities.actions';

import type { TNationalPark } from "@repo/db/index";
// Placeholder SVG for Elephant
function ElephantIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <ellipse cx="12" cy="16" rx="8" ry="5" fill="currentColor" />
      <rect x="6" y="8" width="12" height="8" rx="4" fill="currentColor" />
      <circle cx="8" cy="12" r="2" fill="currentColor" />
      <rect x="16" y="12" width="2" height="4" rx="1" fill="currentColor" />
    </svg>
  );
}

// Placeholder SVG for Hot Air Balloon
function BalloonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <ellipse cx="12" cy="10" rx="6" ry="8" fill="#877B4E" />
      <rect x="10" y="18" width="4" height="3" rx="1" fill="#A5A58D" />
      <rect x="11" y="16" width="2" height="2" rx="1" fill="#A5A58D" />
    </svg>
  );
}

export async function SafariSection({ park }: { park: TNationalPark }) {
  const result = await getActivitiesByParkSlug({
    park_slug: park.slug,
    limit: 5,
  });

  const safariActivities = result.activities;

  const firstActivity = safariActivities[0];
  const restActivities = safariActivities.slice(1);
  return (
    <section className="py-16" id="safari-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title and Description */}
        <div className="mb-12 text-center">
          <h2 className="text-[#9B8B6C] text-3xl font-light mb-4">
            <span className="font-bold">THRILLING ADVENTURES</span> AND
            MEMORABLE ACTIVITIES
          </h2>
          <p className="text-lg text-[#877B4E] font-light max-w-3xl mx-auto">
            Enjoy exciting safaris, peaceful hot air balloon rides, and fun
            river rafting adventures in Jim Corbett National Park.
          </p>
        </div>
        {safariActivities.length == 0 && !firstActivity ? (
          <div className="text-center text-lg text-[#877B4E] font-light max-w-3xl mx-auto">
            No activities found
          </div>
        ) : (
          <>
            <div className="relative overflow-hidden shadow-xl mb-12">
              <img
                src="/a-rugged-open-top-safari-jeep-with-tourists-wearin.png"
                alt="Jeep Safari"
                className="w-full h-[32rem] object-cover"
              />

              {/* Desktop Overlay */}
              <div className="hidden md:flex absolute top-1/2 right-8 -translate-y-1/2 bg-white/95 backdrop-blur-sm shadow-xl p-8 max-w-md w-full flex-col items-start gap-2">
                <h3 className="text-3xl font-bold text-[#877B4E] mb-2">
                  {firstActivity?.name}
                </h3>
                <p className="text-[#6B705C] mb-2 font-light line-clamp-2 overflow-hidden">
                  {firstActivity?.description}
                </p>
                <div className="text-2xl font-bold text-primary">
                  ₹{firstActivity?.packages[0]?.price_1.toLocaleString()}{" "}
                </div>
                <div className="text-xs text-[#9B8B6C] mb-2 font-light">
                  max. {firstActivity?.packages[0]?.number} People allowed in
                  one Jeep
                </div>
                <Link
                  className="px-8 py-3  bg-[#2F2F2F] text-white hover:bg-[#444444] transition-colors"
                  href={`/parks/${park.slug}/activities/${firstActivity?.slug}`}
                >
                  Explore Now
                </Link>
              </div>

              {/* Mobile Overlay */}
              <div className="md:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                <div className="bg-white/95 backdrop-blur-sm shadow-xl flex flex-col gap-2 p-4">
                  <h3 className="text-xl font-bold text-[#877B4E] mb-2">
                    {firstActivity?.name}
                  </h3>
                  <p className="text-[#6B705C] mb-3 line-clamp-2 font-light text-sm">
                    {firstActivity?.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xl font-bold text-primary">
                      ₹{firstActivity?.packages[0]?.price_1.toLocaleString()}
                    </div>
                    <div className="text-xs text-[#9B8B6C] font-light">
                      max. {firstActivity?.packages[0]?.number} People
                    </div>
                  </div>
                  <Link
                    className="w-full px-6 py-3 bg-[#2F2F2F] text-white hover:bg-[#444444] transition-colors"
                    href={`/parks/${park.slug}/activities/${firstActivity?.slug}`}
                  >
                    Explore Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Activities Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {restActivities.map((activity) => {
                // const Icon = activity.icon;
                return (
                  <Card
                    key={activity.id}
                    className="text-center rounded-none group hover:shadow-xl transition-all duration-300 h-full flex flex-col pt-0 bg-white/90 backdrop-blur-sm border-[#C2B280] hover:border-primary"
                  >
                    <div className="relative h-40 mb-4 overflow-hidden">
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                        style={{
                          backgroundImage: `url(${activity.images[0]!.image.small_url})`,
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 flex items-center justify-center">
                        {/* <Icon className="h-10 w-10 text-white" /> */}
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors text-[#877B4E] font-semibold">
                        {activity.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 flex-1 flex flex-col justify-between">
                      <div className="text-xl font-bold text-primary">
                        ₹{activity.packages[0]?.price_1.toLocaleString()}
                      </div>
                      <Link
                        href={`/parks/${park.slug}/activities/${activity.slug}`}
                        className="px-8 py-2 mt-2 bg-[#2F2F2F] text-white hover:bg-[#444444] text-sm transition-colors"
                      >
                        Explore Now
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
      <div className="mt-16 text-center">
        <Link
          href={`/parks/${park.slug}/activities`}
          className="px-8 py-3 bg-[#2F2F2F] text-white hover:bg-[#444444] transition-colors"
        >
          All Activities
        </Link>
      </div>
    </section>
  );
}
