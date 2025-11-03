import {
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Resort } from "./resort.schema";
import { RoomTypes } from "./room-types.schema";

export const roomStatusEnum = pgEnum("room_status", [
  "available",
  "occupied",
  "maintenance",
  "blocked",
]);

export const Rooms = pgTable(
  "rooms",
  {
    id: serial("id").primaryKey(),
    resort_id: integer("resort_id")
      .references(() => Resort.id, { onDelete: "cascade" })
      .notNull(),
    room_type_id: integer("room_type_id")
      .references(() => RoomTypes.id, { onDelete: "cascade" })
      .notNull(),

    room_number: varchar("room_number", { length: 50 }).notNull().unique(),
    floor: integer("floor").notNull(),
    status: roomStatusEnum("status").default("available"),

    notes: text("notes"),

    created_at: timestamp("created_at", { precision: 0 }).defaultNow(),
    updated_at: timestamp("updated_at", { precision: 0 })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("rooms_room_number_idx").on(table.room_number),
    index("rooms_resort_id_idx").on(table.resort_id),
    index("rooms_room_type_id_idx").on(table.room_type_id),
    index("rooms_status_idx").on(table.status),
    index("rooms_floor_idx").on(table.floor),
  ]
);

/**
 * --------------------------------------- Validation Schemas ---------------------------------------
 */
export const insertRoomSchema = createInsertSchema(Rooms, {
  room_number: (schema) =>
    schema.room_number.min(1, "Room number is required").max(50),
  floor: (schema) => schema.floor.min(0, "Floor must be 0 or greater"),
});

export const selectRoomSchema = createSelectSchema(Rooms);

/**
 * --------------------------------------- Type Definitions ---------------------------------------
 */
export type TRoomBase = typeof Rooms.$inferSelect;
export type TNewRoom = typeof Rooms.$inferInsert;
export type TRoomStatus = (typeof roomStatusEnum.enumValues)[number];

