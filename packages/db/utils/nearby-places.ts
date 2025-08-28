/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find nearby places within a specified radius
 * @param hotelLat - Hotel latitude
 * @param hotelLon - Hotel longitude
 * @param places - Array of places with coordinates
 * @param radiusKm - Search radius in kilometers (default: 10)
 * @returns Array of nearby places with distance information
 */
export function findNearbyPlaces(
  hotelLat: number,
  hotelLon: number,
  places: Array<{
    id: number;
    name: string;
    description: string;
    slug: string;
    latitude: string | null;
    longitude: string | null;
    images?: any[];
  }>,
  radiusKm: number = 10
): Array<{
  id: number;
  name: string;
  description: string;
  slug: string;
  distance: number;
  images?: any[];
}> {
  return places
    .filter((place) => {
      if (!place.latitude || !place.longitude) return false;
      
      const placeLat = parseFloat(place.latitude);
      const placeLon = parseFloat(place.longitude);
      
      if (isNaN(placeLat) || isNaN(placeLon)) return false;
      
      const distance = calculateDistance(hotelLat, hotelLon, placeLat, placeLon);
      return distance <= radiusKm;
    })
    .map((place) => {
      const placeLat = parseFloat(place.latitude!);
      const placeLon = parseFloat(place.longitude!);
      const distance = calculateDistance(hotelLat, hotelLon, placeLat, placeLon);
      
      return {
        id: place.id,
        name: place.name,
        description: place.description,
        slug: place.slug,
        distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
        images: place.images,
      };
    })
    .sort((a, b) => a.distance - b.distance); // Sort by distance (closest first)
}

/**
 * Format distance for display
 * @param distanceKm - Distance in kilometers
 * @returns Formatted distance string
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  } else if (distanceKm < 10) {
    return `${Math.round(distanceKm * 10) / 10}km`;
  } else {
    return `${Math.round(distanceKm)}km`;
  }
}
