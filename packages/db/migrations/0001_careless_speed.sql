CREATE TYPE "public"."hotel_type" AS ENUM('resort', 'forest', 'home');--> statement-breakpoint
CREATE TYPE "public"."policy_kind" AS ENUM('include', 'exclude');--> statement-breakpoint
CREATE TYPE "public"."meal_plan" AS ENUM('EP', 'CP', 'MAP', 'AP');--> statement-breakpoint
CREATE TABLE "amenities" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"icon" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cities" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer,
	"name" text NOT NULL,
	"latitude" text,
	"longitude" text,
	"created_at" timestamp (0) DEFAULT now(),
	"updated_at" timestamp (0) DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hotel_amenities" (
	"id" serial PRIMARY KEY NOT NULL,
	"hotel_id" integer,
	"amenity_id" integer,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hotel_faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"faq_id" integer,
	"hotel_id" integer,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hotel_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"hotel_id" integer,
	"image_id" integer,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hotel_policies" (
	"id" serial PRIMARY KEY NOT NULL,
	"policy_id" integer,
	"hotel_id" integer,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hotel_safty_features" (
	"id" serial PRIMARY KEY NOT NULL,
	"safty_feature_id" integer,
	"hotel_id" integer,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hotels" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"slug" text NOT NULL,
	"zone_id" integer,
	"hotel_type" "hotel_type" NOT NULL,
	"rating" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "images" (
	"id" serial PRIMARY KEY NOT NULL,
	"small_url" text NOT NULL,
	"medium_url" text NOT NULL,
	"large_url" text NOT NULL,
	"original_url" text NOT NULL,
	"created_at" timestamp (0) DEFAULT now(),
	"alt_text" text DEFAULT '' NOT NULL,
	"updated_at" timestamp (0) DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "national_parks" (
	"id" serial PRIMARY KEY NOT NULL,
	"city_id" integer NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp (0) DEFAULT now(),
	"updated_at" timestamp (0) DEFAULT now(),
	CONSTRAINT "national_parks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "park_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"park_id" integer NOT NULL,
	"image_id" integer NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "place_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"place_id" integer,
	"image_id" integer,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "places" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"slug" text NOT NULL,
	CONSTRAINT "places_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "policies" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" "policy_kind" NOT NULL,
	"label" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promotions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"link" text NOT NULL,
	"order" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "room_amenities" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_id" integer,
	"amenity_id" integer,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "room_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_id" integer,
	"image_id" integer,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "room_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_id" integer,
	"plan_type" "meal_plan" NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"description" text,
	"is_active" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"room_qty" integer DEFAULT 1 NOT NULL,
	"capacity" integer DEFAULT 2 NOT NULL,
	"hotel_id" integer
);
--> statement-breakpoint
CREATE TABLE "safty_features" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"icon" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "souvenir_images" (
	"souvenir_id" integer NOT NULL,
	"image_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "souvenirs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"price" integer NOT NULL,
	"park_id" integer,
	"is_available" boolean DEFAULT false NOT NULL,
	"created_at" timestamp (0) DEFAULT now(),
	"updated_at" timestamp (0) DEFAULT now(),
	CONSTRAINT "souvenirs_name_unique" UNIQUE("name"),
	CONSTRAINT "souvenirs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "states" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"state_code" text NOT NULL,
	"created_at" timestamp (0) DEFAULT now(),
	"updated_at" timestamp (0) DEFAULT now(),
	CONSTRAINT "states_name_unique" UNIQUE("name"),
	CONSTRAINT "states_state_code_unique" UNIQUE("state_code")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" bigint PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(255),
	"first_name" varchar(225) NOT NULL,
	"last_name" varchar(225) NOT NULL,
	"role" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp (0) DEFAULT now() NOT NULL,
	"updated_at" timestamp (0) DEFAULT now() NOT NULL,
	CONSTRAINT "users_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "zones" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"park_id" integer
);
--> statement-breakpoint
ALTER TABLE "cities" ADD CONSTRAINT "cities_state_id_states_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_amenities" ADD CONSTRAINT "hotel_amenities_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_amenities" ADD CONSTRAINT "hotel_amenities_amenity_id_amenities_id_fk" FOREIGN KEY ("amenity_id") REFERENCES "public"."amenities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_faqs" ADD CONSTRAINT "hotel_faqs_faq_id_faqs_id_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_faqs" ADD CONSTRAINT "hotel_faqs_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_images" ADD CONSTRAINT "hotel_images_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_images" ADD CONSTRAINT "hotel_images_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_policies" ADD CONSTRAINT "hotel_policies_policy_id_policies_id_fk" FOREIGN KEY ("policy_id") REFERENCES "public"."policies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_policies" ADD CONSTRAINT "hotel_policies_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_safty_features" ADD CONSTRAINT "hotel_safty_features_safty_feature_id_safty_features_id_fk" FOREIGN KEY ("safty_feature_id") REFERENCES "public"."safty_features"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_safty_features" ADD CONSTRAINT "hotel_safty_features_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_zone_id_zones_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."zones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "national_parks" ADD CONSTRAINT "national_parks_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "park_images" ADD CONSTRAINT "park_images_park_id_national_parks_id_fk" FOREIGN KEY ("park_id") REFERENCES "public"."national_parks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "park_images" ADD CONSTRAINT "park_images_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place_images" ADD CONSTRAINT "place_images_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place_images" ADD CONSTRAINT "place_images_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_amenities" ADD CONSTRAINT "room_amenities_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_amenities" ADD CONSTRAINT "room_amenities_amenity_id_amenities_id_fk" FOREIGN KEY ("amenity_id") REFERENCES "public"."amenities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_images" ADD CONSTRAINT "room_images_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_images" ADD CONSTRAINT "room_images_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_plans" ADD CONSTRAINT "room_plans_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "souvenir_images" ADD CONSTRAINT "souvenir_images_souvenir_id_souvenirs_id_fk" FOREIGN KEY ("souvenir_id") REFERENCES "public"."souvenirs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "souvenir_images" ADD CONSTRAINT "souvenir_images_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "souvenirs" ADD CONSTRAINT "souvenirs_park_id_national_parks_id_fk" FOREIGN KEY ("park_id") REFERENCES "public"."national_parks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zones" ADD CONSTRAINT "zones_park_id_national_parks_id_fk" FOREIGN KEY ("park_id") REFERENCES "public"."national_parks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "national_parks_slug_idx" ON "national_parks" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "national_parks_name_idx" ON "national_parks" USING btree ("name");--> statement-breakpoint
CREATE INDEX "hotel_policies_kind_idx" ON "policies" USING btree ("kind");--> statement-breakpoint
CREATE INDEX "hotel_policies_label_idx" ON "policies" USING btree ("label");--> statement-breakpoint
CREATE INDEX "souvenirs_name_idx" ON "souvenirs" USING btree ("name");--> statement-breakpoint
CREATE INDEX "souvenirs_park_id_idx" ON "souvenirs" USING btree ("park_id");--> statement-breakpoint
CREATE INDEX "souvenirs_slug_idx" ON "souvenirs" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "souvenirs_is_available_idx" ON "souvenirs" USING btree ("is_available");--> statement-breakpoint
CREATE INDEX "souvenirs_name_availability_idx" ON "souvenirs" USING btree ("name","is_available");--> statement-breakpoint
CREATE UNIQUE INDEX "user_id_unique" ON "users" USING btree ("user_id");