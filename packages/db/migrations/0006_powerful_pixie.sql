CREATE TABLE "activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"slug" text NOT NULL,
	"park_id" integer,
	"rating" integer DEFAULT 0,
	"duration_hours" integer,
	"max_participants" integer,
	"min_age" integer,
	"price" double precision,
	"location" geometry(point),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_amenities" (
	"id" serial PRIMARY KEY NOT NULL,
	"activity_id" integer,
	"amenity_id" integer,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_exclusions" (
	"id" serial PRIMARY KEY NOT NULL,
	"activity_id" integer,
	"exclusion" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"activity_id" integer,
	"image_id" integer,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_inclusions" (
	"id" serial PRIMARY KEY NOT NULL,
	"activity_id" integer,
	"inclusion" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_itinerary" (
	"id" serial PRIMARY KEY NOT NULL,
	"activity_id" integer,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"duration" integer NOT NULL,
	"number" integer NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"activity_id" integer,
	"price" double precision NOT NULL,
	"price_1" double precision NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_park_id_national_parks_id_fk" FOREIGN KEY ("park_id") REFERENCES "public"."national_parks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_amenities" ADD CONSTRAINT "activity_amenities_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_amenities" ADD CONSTRAINT "activity_amenities_amenity_id_amenities_id_fk" FOREIGN KEY ("amenity_id") REFERENCES "public"."amenities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_exclusions" ADD CONSTRAINT "activity_exclusions_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_images" ADD CONSTRAINT "activity_images_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_images" ADD CONSTRAINT "activity_images_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_inclusions" ADD CONSTRAINT "activity_inclusions_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_itinerary" ADD CONSTRAINT "activity_itinerary_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_packages" ADD CONSTRAINT "activity_packages_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activities_location_idx" ON "activities" USING btree ("location");--> statement-breakpoint
CREATE INDEX "activities_name_idx" ON "activities" USING btree ("name");--> statement-breakpoint
CREATE INDEX "activities_slug_idx" ON "activities" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "activities_park_id_idx" ON "activities" USING btree ("park_id");--> statement-breakpoint
CREATE INDEX "activities_rating_idx" ON "activities" USING btree ("rating");