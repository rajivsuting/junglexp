import { Car, Dumbbell, Flame, MapPin, Star, Waves, Wifi } from 'lucide-react';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface ResortCardProps {
  resort: {
    id: string;
    name: string;
    location: string;
    rating: number;
    originalPrice: number;
    discountedPrice: number;
    discount: number;
    image: string;
    amenities: string[];
    category: "Deluxe" | "Luxury" | "Premium" | "Riverside";
  };
}

const amenityIcons = {
  "Swimming Pool": Waves,
  Bonfire: Flame,
  Gym: Dumbbell,
  Wifi: Wifi,
  Parking: Car,
};

export function ResortCard({ resort }: ResortCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 h-full flex flex-col pt-0">
      <div className="relative overflow-hidden">
        <Image
          src={resort.image}
          alt={resort.name}
          unoptimized
          width={400}
          height={250}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-3 left-3 bg-green-600 hover:bg-green-700">
          {resort.discount}% OFF
        </Badge>
        <Badge variant="secondary" className="absolute top-3 right-3">
          {resort.category}
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {resort.name}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="line-clamp-1">{resort.location}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < resort.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-1">
        <div className="flex flex-wrap gap-2 mb-4">
          {resort.amenities.map((amenity) => {
            const Icon = amenityIcons[amenity as keyof typeof amenityIcons];
            return (
              <div
                key={amenity}
                className="flex items-center space-x-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded"
              >
                {Icon && <Icon className="h-3 w-3" />}
                <span>{amenity}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary">
              ₹{resort.discountedPrice.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              ₹{resort.originalPrice.toLocaleString()}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">/Night</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0 mt-auto">
        <Button variant="gradient" className="w-full">
          View Details & Book
        </Button>
      </CardFooter>
    </Card>
  );
}
