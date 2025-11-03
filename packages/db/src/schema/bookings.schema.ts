import {
  date,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Rooms } from "./rooms.schema";
import { RoomTypes } from "./room-types.schema";
import { Users } from "./auth.schema";

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "checked_in",
  "checked_out",
  "cancelled",
  "no_show",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "partial",
  "paid",
  "refunded",
]);

export const Bookings = pgTable(
  "bookings",
  {
    id: serial("id").primaryKey(),

    guest_name: text("guest_name").notNull(),
    guest_email: varchar("guest_email", { length: 255 }).notNull(),
    guest_phone: varchar("guest_phone", { length: 255 }).notNull(),
    guest_address: text("guest_address"),
    guest_id_proof_type: text("guest_id_proof_type"),
    guest_id_proof_number: varchar("guest_id_proof_number", { length: 100 }),

    user_id: text("user_id").references(() => Users.id, {
      onDelete: "set null",
    }),

    room_type_id: integer("room_type_id")
      .references(() => RoomTypes.id, { onDelete: "restrict" })
      .notNull(),
    room_id: integer("room_id").references(() => Rooms.id, {
      onDelete: "set null",
    }),

    check_in_date: date("check_in_date").notNull(),
    check_out_date: date("check_out_date").notNull(),
    number_of_nights: integer("number_of_nights").notNull(),

    number_of_adults: integer("number_of_adults").notNull().default(1),
    number_of_children: integer("number_of_children").notNull().default(0),
    number_of_rooms: integer("number_of_rooms").notNull().default(1),

    room_price_per_night: numeric("room_price_per_night", {
      precision: 10,
      scale: 2,
    }).notNull(),
    total_room_price: numeric("total_room_price", {
      precision: 10,
      scale: 2,
    }).notNull(),
    tax_amount: numeric("tax_amount", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    discount_amount: numeric("discount_amount", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    total_amount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
    paid_amount: numeric("paid_amount", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),

    special_requests: text("special_requests"),
    dietary_requirements: text("dietary_requirements"),

    booking_status: bookingStatusEnum("booking_status")
      .notNull()
      .default("pending"),
    payment_status: paymentStatusEnum("payment_status")
      .notNull()
      .default("pending"),

    booking_source: text("booking_source").default("website"),
    confirmation_code: varchar("confirmation_code", { length: 50 }).unique(),
    admin_notes: text("admin_notes"),

    booking_date: timestamp("booking_date").defaultNow().notNull(),
    check_in_time: timestamp("check_in_time"),
    check_out_time: timestamp("check_out_time"),
    cancelled_at: timestamp("cancelled_at"),
    cancellation_reason: text("cancellation_reason"),

    created_at: timestamp("created_at", { precision: 0 }).defaultNow(),
    updated_at: timestamp("updated_at", { precision: 0 })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("bookings_guest_email_idx").on(table.guest_email),
    index("bookings_guest_phone_idx").on(table.guest_phone),
    index("bookings_user_id_idx").on(table.user_id),
    index("bookings_room_type_id_idx").on(table.room_type_id),
    index("bookings_room_id_idx").on(table.room_id),
    index("bookings_check_in_date_idx").on(table.check_in_date),
    index("bookings_check_out_date_idx").on(table.check_out_date),
    index("bookings_booking_status_idx").on(table.booking_status),
    index("bookings_payment_status_idx").on(table.payment_status),
    index("bookings_confirmation_code_idx").on(table.confirmation_code),
    index("bookings_booking_date_idx").on(table.booking_date),
    index("bookings_dates_status_idx").on(
      table.check_in_date,
      table.check_out_date,
      table.booking_status
    ),
  ]
);

export const BookingPayments = pgTable(
  "booking_payments",
  {
    id: serial("id").primaryKey(),
    booking_id: integer("booking_id")
      .references(() => Bookings.id, { onDelete: "cascade" })
      .notNull(),

    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    payment_method: text("payment_method").notNull(),
    payment_reference: varchar("payment_reference", { length: 255 }),
    payment_notes: text("payment_notes"),

    paid_at: timestamp("paid_at").defaultNow().notNull(),
    created_at: timestamp("created_at", { precision: 0 }).defaultNow(),
  },
  (table) => [
    index("booking_payments_booking_id_idx").on(table.booking_id),
    index("booking_payments_paid_at_idx").on(table.paid_at),
  ]
);

/**
 * --------------------------------------- Validation Schemas ---------------------------------------
 */
export const insertBookingSchema = createInsertSchema(Bookings, {
  guest_name: (schema) => schema.guest_name.min(1, "Guest name is required"),
  guest_email: (schema) => schema.guest_email.email("Invalid email address"),
  guest_phone: (schema) =>
    schema.guest_phone.min(10, "Phone number must be at least 10 digits"),
  number_of_nights: (schema) =>
    schema.number_of_nights.min(1, "Must book at least 1 night"),
  number_of_adults: (schema) =>
    schema.number_of_adults.min(1, "At least 1 adult required"),
  number_of_rooms: (schema) =>
    schema.number_of_rooms.min(1, "At least 1 room required"),
});

export const selectBookingSchema = createSelectSchema(Bookings);

export const insertBookingPaymentSchema = createInsertSchema(BookingPayments);

/**
 * --------------------------------------- Type Definitions ---------------------------------------
 */
export type TBookingBase = typeof Bookings.$inferSelect;
export type TNewBooking = typeof Bookings.$inferInsert;
export type TBookingStatus = (typeof bookingStatusEnum.enumValues)[number];
export type TPaymentStatus = (typeof paymentStatusEnum.enumValues)[number];

export type TBookingPaymentBase = typeof BookingPayments.$inferSelect;
export type TNewBookingPayment = typeof BookingPayments.$inferInsert;

