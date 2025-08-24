CREATE TYPE "public"."faq_subject" AS ENUM('hotel', 'destination', 'park', 'site');--> statement-breakpoint
CREATE TYPE "public"."policy_kind" AS ENUM('include', 'exclude');--> statement-breakpoint
CREATE TYPE "public"."hotel_type" AS ENUM('resort', 'forest');--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"subject" "faq_subject" NOT NULL,
	"subject_id" integer,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hotel_policies" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" "policy_kind" NOT NULL,
	"label" text NOT NULL,
	"hotel_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hotel_safty_features" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"icon" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hotels" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"slug" text NOT NULL,
	"zone_id" integer,
	"hotel_type" "hotel_type" NOT NULL,
	"rating" integer DEFAULT 0,
	"base_price" integer NOT NULL,
	"offer_price" integer
);
--> statement-breakpoint
CREATE TABLE "hotel_amenities_s" (
	"id" serial PRIMARY KEY NOT NULL,
	"hotel_id" integer NOT NULL,
	"amenity_id" integer
);
--> statement-breakpoint
CREATE TABLE "zones" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"park_id" integer
);
--> statement-breakpoint
ALTER TABLE "hotel_amenities" RENAME COLUMN "amenity_id" TO "label";--> statement-breakpoint
ALTER TABLE "park_images" DROP CONSTRAINT "park_images_park_id_national_parks_id_fk";
--> statement-breakpoint
ALTER TABLE "hotel_amenities" DROP CONSTRAINT "hotel_amenities_hotel_id_tour_hotels_id_fk";
--> statement-breakpoint
ALTER TABLE "hotel_amenities" ADD COLUMN "icon" text NOT NULL;--> statement-breakpoint
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_subject_id_hotels_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_policies" ADD CONSTRAINT "hotel_policies_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_zone_id_zones_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."zones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_amenities_s" ADD CONSTRAINT "hotel_amenities_s_hotel_id_tour_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."tour_hotels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zones" ADD CONSTRAINT "zones_park_id_national_parks_id_fk" FOREIGN KEY ("park_id") REFERENCES "public"."national_parks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "faqs_subject_idx" ON "faqs" USING btree ("subject","subject_id","order");--> statement-breakpoint
CREATE UNIQUE INDEX "faqs_unique_subject_question" ON "faqs" USING btree ("subject","subject_id","question");--> statement-breakpoint
CREATE INDEX "hotel_policies_kind_idx" ON "hotel_policies" USING btree ("kind");--> statement-breakpoint
CREATE INDEX "hotel_policies_label_idx" ON "hotel_policies" USING btree ("label");--> statement-breakpoint
ALTER TABLE "park_images" ADD CONSTRAINT "park_images_park_id_national_parks_id_fk" FOREIGN KEY ("park_id") REFERENCES "public"."national_parks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_amenities" ADD CONSTRAINT "hotel_amenities_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE no action ON UPDATE no action;