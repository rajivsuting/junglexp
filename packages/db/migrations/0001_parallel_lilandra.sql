CREATE TYPE "public"."reels_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "reels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"video_url" text NOT NULL,
	"activity_id" uuid,
	"status" "reels_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "activities_name_idx";--> statement-breakpoint
DROP INDEX "activities_park_id_idx";--> statement-breakpoint
DROP INDEX "activities_slug_idx";--> statement-breakpoint
DROP INDEX "souvenirs_name_idx";--> statement-breakpoint
DROP INDEX "souvenirs_park_id_idx";--> statement-breakpoint
DROP INDEX "souvenirs_slug_idx";--> statement-breakpoint
DROP INDEX "email_unique";--> statement-breakpoint
DROP INDEX "phone_unique";--> statement-breakpoint
DROP INDEX "role_unique";--> statement-breakpoint
DROP INDEX "user_id_unique";--> statement-breakpoint
DROP INDEX "hotels_hotel_type_idx";--> statement-breakpoint
DROP INDEX "hotels_hotel_type_rating_idx";--> statement-breakpoint
DROP INDEX "hotels_hotel_type_zone_id_idx";--> statement-breakpoint
DROP INDEX "hotels_hotels_status_hotel_type_idx";--> statement-breakpoint
DROP INDEX "hotels_hotels_status_hotel_type_rating_idx";--> statement-breakpoint
DROP INDEX "hotels_hotels_status_hotel_type_zone_id_idx";--> statement-breakpoint
DROP INDEX "hotels_hotels_status_hotel_type_zone_id_rating_idx";--> statement-breakpoint
DROP INDEX "hotels_hotels_status_is_featured_hotel_type_zone_id_rating_idx";--> statement-breakpoint
DROP INDEX "hotels_is_featured_hotel_type_idx";--> statement-breakpoint
DROP INDEX "hotels_is_featured_hotel_type_rating_idx";--> statement-breakpoint
DROP INDEX "hotels_is_featured_hotel_type_zone_id_idx";--> statement-breakpoint
DROP INDEX "hotels_is_featured_hotel_type_zone_id_rating_idx";--> statement-breakpoint
DROP INDEX "hotels_is_featured_idx";--> statement-breakpoint
DROP INDEX "hotels_location_idx";--> statement-breakpoint
DROP INDEX "hotels_name_idx";--> statement-breakpoint
DROP INDEX "hotels_rating_idx";--> statement-breakpoint
DROP INDEX "hotels_slug_idx";--> statement-breakpoint
DROP INDEX "hotels_status_idx";--> statement-breakpoint
DROP INDEX "hotels_zone_id_idx";--> statement-breakpoint
DROP INDEX "cities_state_id_idx";--> statement-breakpoint
DROP INDEX "hotel_policies_kind_idx";--> statement-breakpoint
DROP INDEX "hotel_policies_label_idx";--> statement-breakpoint
DROP INDEX "national_parks_name_idx";--> statement-breakpoint
DROP INDEX "national_parks_slug_idx";--> statement-breakpoint
DROP INDEX "places_location_idx";--> statement-breakpoint
DROP INDEX "places_name_idx";--> statement-breakpoint
DROP INDEX "places_slug_idx";--> statement-breakpoint
DROP INDEX "naturalist_name_index";--> statement-breakpoint
DROP INDEX "naturalist_park_id_index";--> statement-breakpoint
DROP INDEX "naturalist_park_id_name_index";--> statement-breakpoint
DROP INDEX "hotel_bookings_check_in_date_idx";--> statement-breakpoint
DROP INDEX "hotel_bookings_check_out_date_idx";--> statement-breakpoint
DROP INDEX "hotel_bookings_hotel_id_idx";--> statement-breakpoint
DROP INDEX "hotel_bookings_no_of_adults_idx";--> statement-breakpoint
DROP INDEX "hotel_bookings_no_of_kids_idx";--> statement-breakpoint
DROP INDEX "hotel_bookings_no_of_rooms_required_idx";--> statement-breakpoint
DROP INDEX "hotel_bookings_no_of_rooms_required_no_of_adults_no_of_kids_idx";--> statement-breakpoint
DROP INDEX "hotel_bookings_room_id_idx";--> statement-breakpoint
DROP INDEX "hotel_bookings_status_hotel_id_name_email_mobile_no_idx";--> statement-breakpoint
DROP INDEX "hotel_bookings_status_idx";--> statement-breakpoint
DROP INDEX "hotel_bookings_status_room_id_name_email_mobile_no_idx";--> statement-breakpoint
DROP INDEX "naturalist_bookings_name_email_mobile_no_idx";--> statement-breakpoint
DROP INDEX "naturalist_bookings_park_id_date_of_safari_idx";--> statement-breakpoint
DROP INDEX "naturalist_bookings_park_id_idx";--> statement-breakpoint
DROP INDEX "naturalist_bookings_slot_idx";--> statement-breakpoint
DROP INDEX "naturalist_bookings_specialised_interest_idx";--> statement-breakpoint
DROP INDEX "naturalist_bookings_status_idx";--> statement-breakpoint
DROP INDEX "naturalist_bookings_status_name_email_mobile_no_idx";--> statement-breakpoint
ALTER TABLE "hotels" ALTER COLUMN "location" SET DATA TYPE geometry(point);--> statement-breakpoint
ALTER TABLE "places" ALTER COLUMN "location" SET DATA TYPE geometry(point);--> statement-breakpoint
ALTER TABLE "reels" ADD CONSTRAINT "reels_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reels_status_idx" ON "reels" USING btree ("status");--> statement-breakpoint
CREATE INDEX "reels_activity_id_idx" ON "reels" USING btree ("activity_id");--> statement-breakpoint
CREATE INDEX "activities_name_idx" ON "activities" USING btree ("name");--> statement-breakpoint
CREATE INDEX "activities_park_id_idx" ON "activities" USING btree ("park_id");--> statement-breakpoint
CREATE INDEX "activities_slug_idx" ON "activities" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "souvenirs_name_idx" ON "souvenirs" USING btree ("name");--> statement-breakpoint
CREATE INDEX "souvenirs_park_id_idx" ON "souvenirs" USING btree ("park_id");--> statement-breakpoint
CREATE INDEX "souvenirs_slug_idx" ON "souvenirs" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "email_unique" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "phone_unique" ON "users" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "role_unique" ON "users" USING btree ("user_role");--> statement-breakpoint
CREATE UNIQUE INDEX "user_id_unique" ON "users" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "hotels_hotel_type_idx" ON "hotels" USING btree ("hotel_type");--> statement-breakpoint
CREATE INDEX "hotels_hotel_type_rating_idx" ON "hotels" USING btree ("hotel_type","rating");--> statement-breakpoint
CREATE INDEX "hotels_hotel_type_zone_id_idx" ON "hotels" USING btree ("hotel_type","zone_id");--> statement-breakpoint
CREATE INDEX "hotels_hotels_status_hotel_type_idx" ON "hotels" USING btree ("status","hotel_type");--> statement-breakpoint
CREATE INDEX "hotels_hotels_status_hotel_type_rating_idx" ON "hotels" USING btree ("status","hotel_type","rating");--> statement-breakpoint
CREATE INDEX "hotels_hotels_status_hotel_type_zone_id_idx" ON "hotels" USING btree ("status","hotel_type","zone_id");--> statement-breakpoint
CREATE INDEX "hotels_hotels_status_hotel_type_zone_id_rating_idx" ON "hotels" USING btree ("status","hotel_type","zone_id","rating");--> statement-breakpoint
CREATE INDEX "hotels_hotels_status_is_featured_hotel_type_zone_id_rating_idx" ON "hotels" USING btree ("status","is_featured","hotel_type","zone_id","rating");--> statement-breakpoint
CREATE INDEX "hotels_is_featured_hotel_type_idx" ON "hotels" USING btree ("is_featured","hotel_type");--> statement-breakpoint
CREATE INDEX "hotels_is_featured_hotel_type_rating_idx" ON "hotels" USING btree ("is_featured","hotel_type","rating");--> statement-breakpoint
CREATE INDEX "hotels_is_featured_hotel_type_zone_id_idx" ON "hotels" USING btree ("is_featured","hotel_type","zone_id");--> statement-breakpoint
CREATE INDEX "hotels_is_featured_hotel_type_zone_id_rating_idx" ON "hotels" USING btree ("is_featured","hotel_type","zone_id","rating");--> statement-breakpoint
CREATE INDEX "hotels_is_featured_idx" ON "hotels" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "hotels_location_idx" ON "hotels" USING btree ("location");--> statement-breakpoint
CREATE INDEX "hotels_name_idx" ON "hotels" USING btree ("name");--> statement-breakpoint
CREATE INDEX "hotels_rating_idx" ON "hotels" USING btree ("rating");--> statement-breakpoint
CREATE INDEX "hotels_slug_idx" ON "hotels" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "hotels_status_idx" ON "hotels" USING btree ("status");--> statement-breakpoint
CREATE INDEX "hotels_zone_id_idx" ON "hotels" USING btree ("zone_id");--> statement-breakpoint
CREATE INDEX "cities_state_id_idx" ON "cities" USING btree ("state_id");--> statement-breakpoint
CREATE INDEX "hotel_policies_kind_idx" ON "policies" USING btree ("kind");--> statement-breakpoint
CREATE INDEX "hotel_policies_label_idx" ON "policies" USING btree ("label");--> statement-breakpoint
CREATE INDEX "national_parks_name_idx" ON "national_parks" USING btree ("name");--> statement-breakpoint
CREATE INDEX "national_parks_slug_idx" ON "national_parks" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "places_location_idx" ON "places" USING btree ("location");--> statement-breakpoint
CREATE INDEX "places_name_idx" ON "places" USING btree ("name");--> statement-breakpoint
CREATE INDEX "places_slug_idx" ON "places" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "naturalist_name_index" ON "naturalist" USING btree ("name");--> statement-breakpoint
CREATE INDEX "naturalist_park_id_index" ON "naturalist" USING btree ("park_id");--> statement-breakpoint
CREATE INDEX "naturalist_park_id_name_index" ON "naturalist" USING btree ("park_id","name");--> statement-breakpoint
CREATE INDEX "hotel_bookings_check_in_date_idx" ON "hotel_bookings" USING btree ("check_in_date");--> statement-breakpoint
CREATE INDEX "hotel_bookings_check_out_date_idx" ON "hotel_bookings" USING btree ("check_out_date");--> statement-breakpoint
CREATE INDEX "hotel_bookings_hotel_id_idx" ON "hotel_bookings" USING btree ("hotel_id");--> statement-breakpoint
CREATE INDEX "hotel_bookings_no_of_adults_idx" ON "hotel_bookings" USING btree ("no_of_adults");--> statement-breakpoint
CREATE INDEX "hotel_bookings_no_of_kids_idx" ON "hotel_bookings" USING btree ("no_of_kids");--> statement-breakpoint
CREATE INDEX "hotel_bookings_no_of_rooms_required_idx" ON "hotel_bookings" USING btree ("no_of_rooms_required");--> statement-breakpoint
CREATE INDEX "hotel_bookings_no_of_rooms_required_no_of_adults_no_of_kids_idx" ON "hotel_bookings" USING btree ("no_of_rooms_required","no_of_adults","no_of_kids");--> statement-breakpoint
CREATE INDEX "hotel_bookings_room_id_idx" ON "hotel_bookings" USING btree ("room_id");--> statement-breakpoint
CREATE INDEX "hotel_bookings_status_hotel_id_name_email_mobile_no_idx" ON "hotel_bookings" USING btree ("status","hotel_id","name","email","mobile_no");--> statement-breakpoint
CREATE INDEX "hotel_bookings_status_idx" ON "hotel_bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "hotel_bookings_status_room_id_name_email_mobile_no_idx" ON "hotel_bookings" USING btree ("status","room_id","name","email","mobile_no");--> statement-breakpoint
CREATE INDEX "naturalist_bookings_name_email_mobile_no_idx" ON "naturalist_bookings" USING btree ("name","email","mobile_no");--> statement-breakpoint
CREATE INDEX "naturalist_bookings_park_id_date_of_safari_idx" ON "naturalist_bookings" USING btree ("park_id","date_of_safari");--> statement-breakpoint
CREATE INDEX "naturalist_bookings_park_id_idx" ON "naturalist_bookings" USING btree ("park_id");--> statement-breakpoint
CREATE INDEX "naturalist_bookings_slot_idx" ON "naturalist_bookings" USING btree ("slot");--> statement-breakpoint
CREATE INDEX "naturalist_bookings_specialised_interest_idx" ON "naturalist_bookings" USING btree ("specialised_interest");--> statement-breakpoint
CREATE INDEX "naturalist_bookings_status_idx" ON "naturalist_bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "naturalist_bookings_status_name_email_mobile_no_idx" ON "naturalist_bookings" USING btree ("status","name","email","mobile_no");