import { relations } from "drizzle-orm";

import { Cities } from "./city";
import { Images } from "./image";
import { NationalParks } from "./park";
import { SouvenirImages, Souvenirs } from "./souvenirs";
import { States } from "./state";

export const statesRelations = relations(States, ({ many }) => ({
  cities: many(Cities),
}));

export const citiesRelations = relations(Cities, ({ one }) => ({
  state: one(States, {
    fields: [Cities.state_id],
    references: [States.id],
  }),
}));

export const nationalParksRelations = relations(NationalParks, ({ one }) => ({
  city: one(Cities, {
    fields: [NationalParks.city_id],
    references: [Cities.id],
  }),
}));

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
