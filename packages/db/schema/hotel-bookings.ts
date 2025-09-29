import {
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";

import { Hotels } from "./hotels";
import { RoomPlans, Rooms } from "./rooms";

export const hotelBookingStatusEnum = pgEnum("hotel_booking_status", [
  "pending",
  "confirmed",
  "cancelled",
]);

export const HotelBookings = pgTable(
  "hotel_bookings",
  {
    id: serial("id").primaryKey(),

    name: text("name").notNull(),
    email: text("email").notNull(),
    mobile_no: varchar("mobile_no", { length: 255 }).notNull(),
    check_in_date: date("check_in_date").notNull(),
    check_out_date: date("check_out_date").notNull(),
    no_of_rooms_required: integer("no_of_rooms_required").notNull(),
    no_of_adults: integer("no_of_adults").notNull(),
    no_of_kids: integer("no_of_kids").notNull(),

    status: hotelBookingStatusEnum("status").notNull().default("pending"),
    hotel_id: integer("hotel_id").references(() => Hotels.id, {
      onDelete: "cascade",
    }),
    room_id: integer("room_id").references(() => Rooms.id, {
      onDelete: "cascade",
    }),
    plan_id: integer("plan_id").references(() => RoomPlans.id, {
      onDelete: "cascade",
    }),
  },
  (table) => [
    index("hotel_bookings_room_id_idx").on(table.room_id),
    index("hotel_bookings_hotel_id_idx").on(table.hotel_id),
    index("hotel_bookings_check_in_date_idx").on(table.check_in_date),
    index("hotel_bookings_check_out_date_idx").on(table.check_out_date),
    index("hotel_bookings_no_of_rooms_required_idx").on(
      table.no_of_rooms_required
    ),
    index("hotel_bookings_no_of_adults_idx").on(table.no_of_adults),
    index("hotel_bookings_no_of_kids_idx").on(table.no_of_kids),
    index("hotel_bookings_no_of_rooms_required_no_of_adults_no_of_kids_idx").on(
      table.no_of_rooms_required,
      table.no_of_adults,
      table.no_of_kids
    ),
    index("hotel_bookings_status_idx").on(table.status),
    index("hotel_bookings_status_room_id_name_email_mobile_no_idx").on(
      table.status,
      table.room_id,
      table.name,
      table.email,
      table.mobile_no
    ),
    index("hotel_bookings_status_hotel_id_name_email_mobile_no_idx").on(
      table.status,
      table.hotel_id,
      table.name,
      table.email,
      table.mobile_no
    ),
  ]
);

export type THotelBookingBase = typeof HotelBookings.$inferSelect;
export type TNewHotelBooking = typeof HotelBookings.$inferInsert;
