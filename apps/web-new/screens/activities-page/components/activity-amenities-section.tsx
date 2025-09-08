import {
    Camera, Car, Coffee, Compass, Heart, MapPin, Shield, Users, Utensils, Wifi
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';

interface Amenity {
  amenity?: {
    name: string;
    description?: string | null;
    icon?: string | null;
  } | null;
}

interface ActivityAmenitiesSectionProps {
  amenities: Amenity[];
}

// Map amenity names to icons
const getAmenityIcon = (name: string, iconName?: string | null) => {
  const normalizedName = name.toLowerCase();

  // If there's a specific icon name, try to match it
  if (iconName) {
    const normalizedIcon = iconName.toLowerCase();
    switch (normalizedIcon) {
      case "camera":
        return Camera;
      case "car":
        return Car;
      case "coffee":
        return Coffee;
      case "compass":
        return Compass;
      case "heart":
        return Heart;
      case "map":
      case "mappin":
        return MapPin;
      case "shield":
        return Shield;
      case "users":
        return Users;
      case "utensils":
        return Utensils;
      case "wifi":
        return Wifi;
    }
  }

  // Fallback to name-based matching
  if (normalizedName.includes("photo") || normalizedName.includes("camera"))
    return Camera;
  if (
    normalizedName.includes("transport") ||
    normalizedName.includes("vehicle")
  )
    return Car;
  if (
    normalizedName.includes("coffee") ||
    normalizedName.includes("refreshment")
  )
    return Coffee;
  if (normalizedName.includes("guide") || normalizedName.includes("navigation"))
    return Compass;
  if (normalizedName.includes("safety") || normalizedName.includes("insurance"))
    return Shield;
  if (normalizedName.includes("group") || normalizedName.includes("team"))
    return Users;
  if (normalizedName.includes("meal") || normalizedName.includes("food"))
    return Utensils;
  if (normalizedName.includes("wifi") || normalizedName.includes("internet"))
    return Wifi;
  if (normalizedName.includes("location") || normalizedName.includes("map"))
    return MapPin;

  // Default icon
  return Heart;
};

export function ActivityAmenitiesSection({
  amenities,
}: ActivityAmenitiesSectionProps) {
  if (!amenities || amenities.length === 0) {
    return null;
  }

  const validAmenities = amenities.filter((item) => item.amenity?.name);

  if (validAmenities.length === 0) {
    return null;
  }

  return (
    <section className="py-6 border-b border-border">
      <h2 className="text-xl font-bold text-primary mb-4">What We Provide</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {validAmenities.map((item, index) => {
          const amenity = item.amenity!;
          const IconComponent = getAmenityIcon(amenity.name, amenity.icon);

          return (
            <div
              key={index}
              className="flex flex-col items-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              title={amenity.description || amenity.name}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <IconComponent className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-center text-primary">
                {amenity.name}
              </span>
              {amenity.description && (
                <span className="text-xs text-muted-foreground text-center mt-1">
                  {amenity.description}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
