import { relations } from "drizzle-orm";

import { Amenities } from "./amenities";
import { Cities } from "./city";
import { Faqs } from "./faqs";
import { HotelAmenities } from "./hotel-amenities";
import {
  HotelFaqs,
  HotelImages,
  HotelPolicies,
  Hotels,
  HotelSaftyFeatures,
} from "./hotels";
import { Images } from "./image";
import { NationalParks, ParkImages } from "./park";
import { PlaceImages, Places } from "./places";
import { Policies } from "./policies";
import { RoomAmenities, RoomImages, RoomPlans, Rooms } from "./rooms";
import { SaftyFeatures } from "./safty-features";
import { SouvenirImages, Souvenirs } from "./souvenirs";
import { States } from "./state";
import { Zones } from "./zones";

export const statesRelations = relations(States, ({ many }) => ({
  cities: many(Cities),
}));

export const citiesRelations = relations(Cities, ({ one }) => ({
  state: one(States, {
    fields: [Cities.state_id],
    references: [States.id],
  }),
}));

export const nationalParksRelations = relations(
  NationalParks,
  ({ one, many }) => ({
    city: one(Cities, {
      fields: [NationalParks.city_id],
      references: [Cities.id],
    }),
    images: many(ParkImages),
    zones: many(Zones),
  })
);

export const zonesRelations = relations(Zones, ({ one, many }) => ({
  park: one(NationalParks, {
    fields: [Zones.park_id],
    references: [NationalParks.id],
  }),
  hotels: many(Hotels),
}));

export const placesRelations = relations(Places, ({ many }) => ({
  images: many(PlaceImages),
}));

export const placeImagesRelations = relations(PlaceImages, ({ one }) => ({
  place: one(Places, {
    fields: [PlaceImages.place_id],
    references: [Places.id],
  }),
  image: one(Images, {
    fields: [PlaceImages.image_id],
    references: [Images.id],
  }),
}));

export const parkImagesRelations = relations(ParkImages, ({ one }) => ({
  park: one(NationalParks, {
    fields: [ParkImages.park_id],
    references: [NationalParks.id],
  }),
  image: one(Images, {
    fields: [ParkImages.image_id],
    references: [Images.id],
  }),
}));

/**
--------------------------------------- Hotels ---------------------------------------
*/
export const hotelRelations = relations(Hotels, ({ one, many }) => ({
  zone: one(Zones, {
    fields: [Hotels.zone_id],
    references: [Zones.id],
  }),
  policies: many(HotelPolicies),
  saftyFeatures: many(HotelSaftyFeatures),
  amenities: many(HotelAmenities),
  faqs: many(HotelFaqs),
  images: many(HotelImages),
  rooms: many(Rooms),
}));

export const hotelImagesRelations = relations(HotelImages, ({ one }) => ({
  hotel: one(Hotels, {
    fields: [HotelImages.hotel_id],
    references: [Hotels.id],
  }),
  image: one(Images, {
    fields: [HotelImages.image_id],
    references: [Images.id],
  }),
}));

export const hotelAmenitiesRelations = relations(HotelAmenities, ({ one }) => ({
  hotel: one(Hotels, {
    fields: [HotelAmenities.hotel_id],
    references: [Hotels.id],
  }),
  amenity: one(Amenities, {
    fields: [HotelAmenities.amenity_id],
    references: [Amenities.id],
  }),
}));

export const hotelFaqsRelations = relations(HotelFaqs, ({ one }) => ({
  hotel: one(Hotels, {
    fields: [HotelFaqs.hotel_id],
    references: [Hotels.id],
  }),
  faq: one(Faqs, {
    fields: [HotelFaqs.faq_id],
    references: [Faqs.id],
  }),
}));

export const hotelPoliciesRelations = relations(HotelPolicies, ({ one }) => ({
  hotel: one(Hotels, {
    fields: [HotelPolicies.hotel_id],
    references: [Hotels.id],
  }),
  policy: one(Policies, {
    fields: [HotelPolicies.policy_id],
    references: [Policies.id],
  }),
}));

export const hotelSaftyFeaturesRelations = relations(
  HotelSaftyFeatures,
  ({ one }) => ({
    hotel: one(Hotels, {
      fields: [HotelSaftyFeatures.hotel_id],
      references: [Hotels.id],
    }),
    feature: one(SaftyFeatures, {
      fields: [HotelSaftyFeatures.safty_feature_id],
      references: [SaftyFeatures.id],
    }),
  })
);

export const saftyFeatureRelations = relations(SaftyFeatures, ({ many }) => ({
  hotels: many(HotelSaftyFeatures),
}));

export const amenityRelations = relations(Amenities, ({ many }) => ({
  hotel: many(HotelAmenities),
}));

/**
--------------------------------------- Souvenirs ---------------------------------------
*/
export const imageRelations = relations(Images, ({ many }) => ({
  souvenir_images: many(SouvenirImages),
}));

export const souvenirsRelations = relations(Souvenirs, ({ one, many }) => ({
  park: one(NationalParks, {
    fields: [Souvenirs.park_id],
    references: [NationalParks.id],
  }),
  images: many(SouvenirImages),
}));

export const souvenirImageRelations = relations(SouvenirImages, ({ one }) => ({
  souvenir: one(Souvenirs, {
    fields: [SouvenirImages.souvenir_id],
    references: [Souvenirs.id],
  }),
  image: one(Images, {
    fields: [SouvenirImages.image_id],
    references: [Images.id],
  }),
}));

/**
--------------------------------------- Rooms ---------------------------------------
*/
export const roomRelations = relations(Rooms, ({ one, many }) => ({
  hotel: one(Hotels, {
    fields: [Rooms.hotel_id],
    references: [Hotels.id],
  }),
  images: many(RoomImages),
  amenities: many(RoomAmenities),
  plans: many(RoomPlans),
}));

export const roomImagesRelations = relations(RoomImages, ({ one }) => ({
  room: one(Rooms, {
    fields: [RoomImages.room_id],
    references: [Rooms.id],
  }),
  image: one(Images, {
    fields: [RoomImages.image_id],
    references: [Images.id],
  }),
}));

export const roomAmenitiesRelations = relations(RoomAmenities, ({ one }) => ({
  room: one(Rooms, {
    fields: [RoomAmenities.room_id],
    references: [Rooms.id],
  }),
  amenity: one(Amenities, {
    fields: [RoomAmenities.amenity_id],
    references: [Amenities.id],
  }),
}));

export const roomPlansRelations = relations(RoomPlans, ({ one }) => ({
  room: one(Rooms, {
    fields: [RoomPlans.room_id],
    references: [Rooms.id],
  }),
}));
