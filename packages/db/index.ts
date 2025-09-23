import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';

import {
    Activities, ActivityAmenities, ActivityImages, ActivityItinerary, ActivityPackages,
    ActivityPolicies
} from './schema/activities';
import { Amenities } from './schema/amenities';
import { Cities } from './schema/city';
import { Faqs } from './schema/faqs';
import { HotelAmenities } from './schema/hotel-amenities';
import { HotelFaqs, HotelImages, HotelPolicies, Hotels, HotelSaftyFeatures } from './schema/hotels';
import { Images } from './schema/image';
import { Naturalist } from './schema/naturalist';
import { NationalParks, ParkImages } from './schema/park';
import { PlaceImages, Places } from './schema/places';
import { Policies } from './schema/policies';
import { Promotions } from './schema/promotions';
import * as relations from './schema/relations';
import { RoomAmenities, RoomImages, RoomPlans, Rooms } from './schema/rooms';
import { SaftyFeatures } from './schema/safty-features';
import { SouvenirImages, Souvenirs } from './schema/souvenirs';
import { States } from './schema/state';
import { Users } from './schema/user';
import { Zones } from './schema/zones';

export * from "drizzle-orm";
export { nationaParkInsertSchema } from "./schema/park";
export type { TUser, TNewUser } from "./schema/user";
export type { TNationalParkBase, TNewNationalPark } from "./schema/park";
export type { TState, TNewState } from "./schema/state";
export type { TCity, TNewCity } from "./schema/city";
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
} from "./schema/rooms";
export type {
  TPlaceBase,
  TNewPlace,
  TPlaceImageBase,
  TNewPlaceImage,
} from "./schema/places";
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
} from "./schema/activities";
export * from "./schema/types";

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
};

export const schema = {
  ...schemaWithoutRelations,
  ...relations,
};

config({ path: "../../.env.local" });

export const db = drizzle(process.env.DATABASE_URL!, { schema });
