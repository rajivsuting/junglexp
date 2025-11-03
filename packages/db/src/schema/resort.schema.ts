import {
  boolean,
  geometry,
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

import { Faqs } from "./faqs.schema";
import { Images } from "./images.schema";
import { Policies } from "./policies.schema";

export const resortStatusEnum = pgEnum("resort_status", [
  "active",
  "maintenance",
  "inactive",
]);

export const Resort = pgTable(
  "resort",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    tagline: text("tagline"),
    description: text("description").notNull(),
    
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 255 }).notNull(),
    whatsapp: varchar("whatsapp", { length: 255 }),
    
    address_line1: text("address_line1").notNull(),
    address_line2: text("address_line2"),
    city: text("city").notNull(),
    state: text("state").notNull(),
    country: text("country").notNull().default("India"),
    pincode: varchar("pincode", { length: 10 }).notNull(),
    
    location: geometry("location", {
      type: "point",
      mode: "xy",
      srid: 4326,
    }).notNull(),
    
    status: resortStatusEnum("status").default("active"),
    check_in_time: text("check_in_time").notNull().default("14:00"),
    check_out_time: text("check_out_time").notNull().default("11:00"),
    total_rooms: integer("total_rooms").notNull().default(0),
    
    facebook_url: text("facebook_url"),
    instagram_url: text("instagram_url"),
    twitter_url: text("twitter_url"),
    youtube_url: text("youtube_url"),
    
    meta_title: text("meta_title"),
    meta_description: text("meta_description"),
    meta_keywords: text("meta_keywords"),
    
    created_at: timestamp("created_at", { precision: 0 }).defaultNow(),
    updated_at: timestamp("updated_at", { precision: 0 })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("resort_slug_idx").on(table.slug),
    index("resort_status_idx").on(table.status),
    index("resort_location_idx").on(table.location),
  ]
);

export const ResortImages = pgTable("resort_images", {
  id: serial("id").primaryKey(),
  resort_id: integer("resort_id")
    .references(() => Resort.id, { onDelete: "cascade" })
    .notNull(),
  image_id: integer("image_id")
    .references(() => Images.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull().default(0),
  is_hero: boolean("is_hero").notNull().default(false),
});

export const ResortPolicies = pgTable("resort_policies", {
  id: serial("id").primaryKey(),
  resort_id: integer("resort_id")
    .references(() => Resort.id, { onDelete: "cascade" })
    .notNull(),
  policy_id: integer("policy_id")
    .references(() => Policies.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull().default(0),
});

export const ResortFaqs = pgTable("resort_faqs", {
  id: serial("id").primaryKey(),
  resort_id: integer("resort_id")
    .references(() => Resort.id, { onDelete: "cascade" })
    .notNull(),
  faq_id: integer("faq_id")
    .references(() => Faqs.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull().default(0),
});

export const insertResortSchema = createInsertSchema(Resort, {
  name: (schema) => schema.name.min(1, "Resort name is required").max(255),
  email: (schema) => schema.email.email("Invalid email address"),
  phone: (schema) =>
    schema.phone.min(10, "Phone number must be at least 10 digits"),
});

export const selectResortSchema = createSelectSchema(Resort);

export type TResortBase = typeof Resort.$inferSelect;
export type TNewResort = typeof Resort.$inferInsert;
export type TResortStatus = (typeof resortStatusEnum.enumValues)[number];

export type TResortImageBase = typeof ResortImages.$inferSelect;
export type TNewResortImage = typeof ResortImages.$inferInsert;

export type TResortPolicyBase = typeof ResortPolicies.$inferSelect;
export type TNewResortPolicy = typeof ResortPolicies.$inferInsert;

export type TResortFaqBase = typeof ResortFaqs.$inferSelect;
export type TNewResortFaq = typeof ResortFaqs.$inferInsert;

