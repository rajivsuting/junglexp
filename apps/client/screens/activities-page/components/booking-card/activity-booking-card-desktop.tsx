"use client";

import { Clock, Star, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Package {
  id: number;
  name: string;
  price: number;
  duration?: string | null;
  max_participants?: number | null;
}

interface ActivityBookingCardDesktopProps {
  packages: Package[];
  basePrice: number;
  rating?: number | null;
  duration?: string | null;
  maxGroupSize?: number | null;
}

export function ActivityBookingCardDesktop({
  packages,
  basePrice,
  rating,
  duration,
  maxGroupSize,
}: ActivityBookingCardDesktopProps) {
  const price = packages?.[0]?.price || basePrice;
  const maxParticipants = packages?.[0]?.max_participants || maxGroupSize || 10;

  const scrollToPackages = () => {
    const packagesSection = document.getElementById("packages");
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="hidden lg:block">
      <Card className="sticky top-8 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                ₹{price.toLocaleString()}
              </CardTitle>
              <p className="text-muted-foreground text-sm">per person</p>
            </div>
            {rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{rating}</span>
              </div>
            )}
          </div>

          {/* Activity Info */}
          <div className="flex flex-wrap gap-3 mt-3">
            {duration && (
              <Badge variant="secondary" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {duration}
              </Badge>
            )}
            {maxParticipants && (
              <Badge variant="secondary" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                Max {maxParticipants}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <Button onClick={scrollToPackages} className="w-full" size="lg">
            Book Now
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Free cancellation up to 24 hours before the activity
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
