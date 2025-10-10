import {
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  uuid,
} from "drizzle-orm/pg-core";

import { Activities } from "./activities";

export const activityBookingStatusEnum = pgEnum("activity_booking_status", [
  "pending",
  "confirmed",
  "cancelled",
]);

export const ActivityBookings = pgTable("activity_bookings", {
  id: uuid("booking_id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  mobile: text("mobile").notNull(),
  email: text("email").notNull(),
  preferredDate: date("preferred_date").notNull(),
  numberOfAdults: integer("number_of_adults").notNull(),
  numberOfKids: integer("number_of_kids").notNull(),
  message: text("message"),
  status: activityBookingStatusEnum("status").notNull().default("pending"),

  activity_id: integer("activity_id")
    .references(() => Activities.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export type TActivityBookingBase = typeof ActivityBookings.$inferSelect;
export type TNewActivityBooking = typeof ActivityBookings.$inferInsert;
