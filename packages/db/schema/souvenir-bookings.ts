import {
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  uuid,
} from "drizzle-orm/pg-core";

import { Souvenirs } from "./souvenirs";

export const souvenirBookingStatusEnum = pgEnum("souvenir_booking_status", [
  "pending",
  "confirmed",
  "cancelled",
]);

export const SouvenirBookings = pgTable("souvenir_bookings", {
  id: uuid("booking_id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  mobile: text("mobile").notNull(),
  email: text("email").notNull(),
  souvenir_id: integer("souvenir_id")
    .references(() => Souvenirs.id, {
      onDelete: "cascade",
    })
    .notNull(),
  rate: integer("rate").notNull(),
  quantity: integer("quantity").notNull(),

  message: text("message"),
  status: souvenirBookingStatusEnum("status").notNull().default("pending"),
});

export type TSouvenirBookingBase = typeof SouvenirBookings.$inferSelect;
export type TNewSouvenirBooking = typeof SouvenirBookings.$inferInsert;
