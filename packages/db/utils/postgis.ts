import { sql } from "drizzle-orm";

/**
 * PostGIS utility functions for working with geometry fields
 */

/**
 * Create a POINT geometry from latitude and longitude coordinates
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns SQL expression for POINT geometry
 */
export const createPoint = (lat: number, lng: number) => {
  return sql`ST_GeomFromText('POINT(${lng} ${lat})', 4326)`;
};

/**
 * Extract X coordinate (longitude) from a geometry point
 * @param geometryColumn - The geometry column reference
 * @returns SQL expression for X coordinate
 */
export const getX = (geometryColumn: any) => {
  return sql`ST_X(${geometryColumn})`;
};

/**
 * Extract Y coordinate (latitude) from a geometry point
 * @param geometryColumn - The geometry column reference
 * @returns SQL expression for Y coordinate
 */
export const getY = (geometryColumn: any) => {
  return sql`ST_Y(${geometryColumn})`;
};

/**
 * Calculate distance between two geometry points using PostGIS ST_Distance
 * @param geom1 - First geometry column
 * @param geom2 - Second geometry column
 * @param useSpheroid - Whether to use spheroid calculation (default: true)
 * @returns SQL expression for distance in meters
 */
export const getDistance = (
  geom1: any,
  geom2: any,
  useSpheroid: boolean = true
) => {
  if (useSpheroid) {
    return sql`ST_Distance(${geom1}, ${geom2}, true)`;
  }
  return sql`ST_Distance(${geom1}, ${geom2})`;
};

/**
 * Create a POINT geometry from coordinates and convert to meters
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns SQL expression for POINT geometry in meters
 */
export const createPointInMeters = (lat: number, lng: number) => {
  return sql`ST_Transform(ST_GeomFromText('POINT(${lng} ${lat})', 4326), 3857)`;
};

/**
 * Find places within a certain radius using PostGIS ST_DWithin
 * @param geometryColumn - The geometry column to search within
 * @param centerLat - Center latitude
 * @param centerLng - Center longitude
 * @param radiusMeters - Search radius in meters
 * @returns SQL expression for spatial search
 */
export const withinRadius = (
  geometryColumn: any,
  centerLat: number,
  centerLng: number,
  radiusMeters: number
) => {
  const centerPoint = createPoint(centerLat, centerLng);
  return sql`ST_DWithin(${geometryColumn}, ${centerPoint}, ${radiusMeters})`;
};

export const getSqlPoint = (point: { x: number; y: number }) => {
  return sql`ST_SetSRID(ST_MakePoint(${point.x}, ${point.y}), 4326)`;
};
