import { integer, numeric, pgEnum, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

import { Amenities } from './amenities'
import { Hotels } from './hotels'
import { Images } from './image'

// Define meal plan enum
export const mealPlanEnum = pgEnum('meal_plan', [
  'EP', // European Plan - Room only
  'CP', // Continental Plan - Room + Breakfast
  'MAP', // Modified American Plan - Room + Breakfast + Dinner
  'AP', // American Plan - Room + All meals (Breakfast, Lunch, Dinner)
])

export const Rooms = pgTable('rooms', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  room_qty: integer('room_qty').notNull().default(1),
  capacity: integer('capacity').notNull().default(2),
  hotel_id: integer('hotel_id').references(() => Hotels.id, {
    onDelete: 'cascade',
  }),
})

export const RoomImages = pgTable('room_images', {
  id: serial('id').primaryKey(),
  room_id: integer('room_id').references(() => Rooms.id, {
    onDelete: 'cascade',
  }),
  image_id: integer('image_id').references(() => Images.id, {
    onDelete: 'cascade',
  }),
  order: integer('order').notNull().default(0),
})

export const RoomAmenities = pgTable('room_amenities', {
  id: serial('id').primaryKey(),
  room_id: integer('room_id').references(() => Rooms.id, {
    onDelete: 'cascade',
  }),
  amenity_id: integer('amenity_id').references(() => Amenities.id, {
    onDelete: 'cascade',
  }),
  order: integer('order').notNull().default(0),
})

export const RoomPlans = pgTable('room_plans', {
  id: serial('id').primaryKey(),
  room_id: integer('room_id').references(() => Rooms.id, {
    onDelete: 'cascade',
  }),
  plan_type: mealPlanEnum('plan_type').notNull(),
  price: integer('price').notNull().default(0),
  description: text('description'),
  is_active: integer('is_active').notNull().default(1), // 1 for active, 0 for inactive
})

/**
--------------------------------------- Validation Schemas ---------------------------------------
*/
export const roomsInsertSchema = createInsertSchema(Rooms, {
  name: schema => schema.name.min(1, 'Room name is required').max(255),
  description: schema => schema.description.min(1, 'Room description is required'),
  // room_qty: schema => schema.room_qty.min(1, 'Room quantity must be at least 1'),
  // capacity: schema => schema.capacity.min(1, 'Room capacity must be at least 1'),
})

export const roomsSelectSchema = createSelectSchema(Rooms)
export const roomImagesInsertSchema = createInsertSchema(RoomImages)
export const roomAmenitiesInsertSchema = createInsertSchema(RoomAmenities)
export const roomPlansInsertSchema = createInsertSchema(RoomPlans, {
  // price: schema => schema.price.min(0, 'Price must be non-negative'),
})

/** 
  --------------------------------------- Type Definitions ---------------------------------------
  */
export type TRoomBase = typeof Rooms.$inferSelect
export type TNewRoom = typeof Rooms.$inferInsert

export type TRoomImageBase = typeof RoomImages.$inferSelect
export type TNewRoomImage = typeof RoomImages.$inferInsert

export type TRoomAmenityBase = typeof RoomAmenities.$inferSelect
export type TNewRoomAmenity = typeof RoomAmenities.$inferInsert

export type TRoomPlanBase = typeof RoomPlans.$inferSelect
export type TNewRoomPlan = typeof RoomPlans.$inferInsert

export type TMealPlan = (typeof mealPlanEnum.enumValues)[number]

export type TRoomInsert = typeof roomsInsertSchema

// Meal plan descriptions for reference
export const MEAL_PLAN_DESCRIPTIONS = {
  EP: 'European Plan - Room only (no meals included)',
  CP: 'Continental Plan - Room + Daily breakfast',
  MAP: 'Modified American Plan - Room + Breakfast + Dinner',
  AP: 'American Plan - Room + All meals (Breakfast, Lunch, Dinner)',
} as const
