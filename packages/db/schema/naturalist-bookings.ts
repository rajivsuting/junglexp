import {
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
} from "drizzle-orm/pg-core";

import { Activities } from "./activities";
import { NationalParks } from "./park";

export const naturalistBookingStatusEnum = pgEnum("naturalist_booking_status", [
  "pending",
  "confirmed",
  "cancelled",
]);

export const NaturalistBookings = pgTable(
  "naturalist_bookings",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    mobile_no: text("mobile_no").notNull(),
    date_of_safari: date("date_of_safari").notNull(),
    slot: text("slot").notNull(),
    park_id: integer("park_id").references(() => NationalParks.id, {
      onDelete: "cascade",
    }),
    activity_id: integer("activity_id").references(() => Activities.id, {
      onDelete: "set null",
    }),
    specialised_interest: text("specialised_interest").notNull(),

    status: naturalistBookingStatusEnum("status").notNull().default("pending"),
  },
  (table) => [
    index("naturalist_bookings_park_id_date_of_safari_idx").on(
      table.park_id,
      table.date_of_safari
    ),
    index("naturalist_bookings_slot_idx").on(table.slot),
    index("naturalist_bookings_specialised_interest_idx").on(
      table.specialised_interest
    ),
    index("naturalist_bookings_name_email_mobile_no_idx").on(
      table.name,
      table.email,
      table.mobile_no
    ),
    index("naturalist_bookings_status_idx").on(table.status),
    index("naturalist_bookings_status_name_email_mobile_no_idx").on(
      table.status,
      table.name,
      table.email,
      table.mobile_no
    ),
    index("naturalist_bookings_park_id_idx").on(table.park_id),
  ]
);

export type TNaturalistBookingBase = typeof NaturalistBookings.$inferSelect;
export type TNewNaturalistBooking = typeof NaturalistBookings.$inferInsert;
