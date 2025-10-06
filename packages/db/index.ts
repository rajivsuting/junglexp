import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http'

import {
  Activities,
  ActivityAmenities,
  ActivityImages,
  ActivityItinerary,
  ActivityPackages,
  ActivityPolicies,
} from './schema/activities'
import { Amenities } from './schema/amenities'
import { Cities } from './schema/city'
import { Faqs } from './schema/faqs'
import { HotelAmenities } from './schema/hotel-amenities'
import { HotelBookings, hotelBookingStatusEnum } from './schema/hotel-bookings'
import { HotelFaqs, HotelImages, HotelPolicies, Hotels, HotelSaftyFeatures } from './schema/hotels'
import { Images } from './schema/image'
import { Naturalist } from './schema/naturalist'
import { NaturalistBookings, naturalistBookingStatusEnum } from './schema/naturalist-bookings'
import { NationalParks, ParkImages } from './schema/park'
import { PlaceImages, Places } from './schema/places'
import { Policies } from './schema/policies'
import { Promotions } from './schema/promotions'
import { Reels, reelsStatusEnum } from './schema/reels'
import * as relations from './schema/relations'
import { RoomAmenities, RoomImages, RoomPlans, Rooms } from './schema/rooms'
import { SaftyFeatures } from './schema/safty-features'
import { SouvenirImages, Souvenirs } from './schema/souvenirs'
import { States } from './schema/state'
import { Users } from './schema/user'
import { Zones } from './schema/zones'

export * from 'drizzle-orm'
export { nationaParkInsertSchema } from './schema/park'
export type { TUser, TNewUser } from './schema/user'
export type { TNationalParkBase, TNewNationalPark } from './schema/park'
export type { TState, TNewState } from './schema/state'
export type { TCity, TNewCity } from './schema/city'
export type {
  TRoomBase,
  TNewRoom,
  TRoomImageBase,
  TNewRoomImage,
  TRoomAmenityBase,
  TNewRoomAmenity,
  TRoomPlanBase,
  TNewRoomPlan,
  TMealPlan,
  MEAL_PLAN_DESCRIPTIONS,
} from './schema/rooms'
export type { TPlaceBase, TNewPlace, TPlaceImageBase, TNewPlaceImage } from './schema/places'
export type {
  TActivityBase,
  TNewActivity,
  TActivityImageBase,
  TNewActivityImage,
  TActivityItineraryBase,
  TNewActivityItinerary,
  TActivityAmenityBase,
  TNewActivityAmenity,
  TActivityPackageBase,
  TNewActivityPackage,
} from './schema/activities'
export * from './schema/types'

export const schemaWithoutRelations = {
  Users,
  NationalParks,
  States,
  Cities,
  Images,
  Souvenirs,
  SouvenirImages,
  ParkImages,
  HotelAmenities,
  Amenities,
  Policies,
  Faqs,
  SaftyFeatures,
  HotelSaftyFeatures,
  HotelImages,
  Hotels,
  Zones,
  HotelPolicies,
  Promotions,
  HotelFaqs,
  Places,
  PlaceImages,
  Rooms,
  RoomImages,
  RoomAmenities,
  RoomPlans,
  Activities,
  ActivityImages,
  ActivityItinerary,
  ActivityAmenities,
  ActivityPackages,
  ActivityPolicies,
  Naturalist,
  HotelBookings,
  hotelBookingStatusEnum,
  NaturalistBookings,
  naturalistBookingStatusEnum,
  Reels,
  reelsStatusEnum,
}

export const schema = {
  ...schemaWithoutRelations,
  ...relations,
}

config({ path: '../../.env' })

// Safe database connection that won't fail during build
// export const db = drizzle(process.env.DATABASE_URL!, { schema })

export const db = process.env.DATABASE_URL ? drizzle(process.env.DATABASE_URL, { schema }) : null

// export const db = new Proxy({} as any, {
//   get(target, prop) {
//     return getDb()[prop];
//   },
// });
