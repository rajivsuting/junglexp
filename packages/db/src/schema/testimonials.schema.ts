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
import { createInsertSchema } from "drizzle-zod";

import { Images } from "./images.schema";
import { Resort } from "./resort.schema";
import { Users } from "./auth.schema";

export const testimonialStatusEnum = pgEnum("testimonial_status", [
  "pending",
  "approved",
  "rejected",
]);

export const Testimonials = pgTable(
  "testimonials",
  {
    id: serial("id").primaryKey(),
    resort_id: integer("resort_id")
      .references(() => Resort.id, { onDelete: "cascade" })
      .notNull(),

    guest_name: text("guest_name").notNull(),
    guest_email: varchar("guest_email", { length: 255 }),
    guest_location: text("guest_location"),
    guest_avatar_id: integer("guest_avatar_id").references(() => Images.id, {
      onDelete: "set null",
    }),

    user_id: text("user_id").references(() => Users.id, {
      onDelete: "set null",
    }),

    title: text("title"),
    content: text("content").notNull(),
    rating: integer("rating").notNull(),

    stay_date: timestamp("stay_date"),
    platform: text("platform").default("website"),
    
    status: testimonialStatusEnum("status").notNull().default("pending"),
    is_featured: integer("is_featured").notNull().default(0),
    
    admin_notes: text("admin_notes"),

    created_at: timestamp("created_at", { precision: 0 }).defaultNow(),
    updated_at: timestamp("updated_at", { precision: 0 })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("testimonials_resort_id_idx").on(table.resort_id),
    index("testimonials_user_id_idx").on(table.user_id),
    index("testimonials_status_idx").on(table.status),
    index("testimonials_rating_idx").on(table.rating),
    index("testimonials_is_featured_idx").on(table.is_featured),
  ]
);

export const insertTestimonialSchema = createInsertSchema(Testimonials, {
  guest_name: (schema) => schema.guest_name.min(1, "Guest name is required"),
  content: (schema) =>
    schema.content.min(10, "Review must be at least 10 characters"),
  rating: (schema) => schema.rating.min(1).max(5),
});

export type TTestimonialBase = typeof Testimonials.$inferSelect;
export type TNewTestimonial = typeof Testimonials.$inferInsert;
export type TTestimonialStatus =
  (typeof testimonialStatusEnum.enumValues)[number];

