"use client";

import { Star, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface Package {
  id: number;
  name: string;
  price: number;
  max_participants?: number | null;
}

interface ActivityBookingCardMobileProps {
  packages: Package[];
  basePrice: number;
  rating?: number | null;
  maxGroupSize?: number | null;
}

export function ActivityBookingCardMobile({
  packages,
  basePrice,
  rating,
  maxGroupSize,
}: ActivityBookingCardMobileProps) {
  const price = packages?.[0]?.price || basePrice;
  const maxParticipants = packages?.[0]?.max_participants || maxGroupSize || 10;

  const scrollToPackages = () => {
    const packagesSection = document.getElementById("packages");
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Fixed Bottom Bar - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 z-50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  ₹{price.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">
                  per person
                </span>
                {rating && (
                  <div className="flex items-center gap-1 ml-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{rating}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>Max {maxParticipants} people</span>
              </div>
            </div>
          </div>

          <Button onClick={scrollToPackages} size="lg" className="px-8">
            Book Now
          </Button>
        </div>
      </div>

      {/* Spacer for fixed bottom bar */}
      <div className="lg:hidden h-24" />
    </>
  );
}
