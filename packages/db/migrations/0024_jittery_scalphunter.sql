CREATE TYPE "public"."hotel_booking_status" AS ENUM('pending', 'confirmed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."naturalist_booking_status" AS ENUM('pending', 'confirmed', 'cancelled');--> statement-breakpoint
CREATE TABLE "hotel_bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"mobile_no" integer NOT NULL,
	"check_in_date" date NOT NULL,
	"check_out_date" date NOT NULL,
	"no_of_rooms_required" integer NOT NULL,
	"no_of_adults" integer NOT NULL,
	"no_of_kids" integer NOT NULL,
	"status" "hotel_booking_status" DEFAULT 'pending' NOT NULL,
	"hotel_id" integer,
	"room_id" integer
);
--> statement-breakpoint
CREATE TABLE "naturalist_bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"mobile_no" text NOT NULL,
	"date_of_safari" date NOT NULL,
	"slot" text NOT NULL,
	"national_park" text NOT NULL,
	"specialised_interest" text NOT NULL,
	"status" "naturalist_booking_status" DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hotel_bookings" ADD CONSTRAINT "hotel_bookings_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_bookings" ADD CONSTRAINT "hotel_bookings_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "hotel_bookings_room_id_idx" ON "hotel_bookings" USING btree ("room_id");--> statement-breakpoint
CREATE INDEX "hotel_bookings_hotel_id_idx" ON "hotel_bookings" USING btree ("hotel_id");--> statement-breakpoint
CREATE INDEX "hotel_bookings_check_in_date_idx" ON "hotel_bookings" USING btree ("check_in_date");--> statement-breakpoint
CREATE INDEX "hotel_bookings_check_out_date_idx" ON "hotel_bookings" USING btree ("check_out_date");--> statement-breakpoint
CREATE INDEX "hotel_bookings_no_of_rooms_required_idx" ON "hotel_bookings" USING btree ("no_of_rooms_required");--> statement-breakpoint
CREATE INDEX "hotel_bookings_no_of_adults_idx" ON "hotel_bookings" USING btree ("no_of_adults");--> statement-breakpoint
CREATE INDEX "hotel_bookings_no_of_kids_idx" ON "hotel_bookings" USING btree ("no_of_kids");--> statement-breakpoint
CREATE INDEX "hotel_bookings_no_of_rooms_required_no_of_adults_no_of_kids_idx" ON "hotel_bookings" USING btree ("no_of_rooms_required","no_of_adults","no_of_kids");--> statement-breakpoint
CREATE INDEX "hotel_bookings_status_idx" ON "hotel_bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "hotel_bookings_status_room_id_name_email_mobile_no_idx" ON "hotel_bookings" USING btree ("status","room_id","name","email","mobile_no");--> statement-breakpoint
CREATE INDEX "hotel_bookings_status_hotel_id_name_email_mobile_no_idx" ON "hotel_bookings" USING btree ("status","hotel_id","name","email","mobile_no");--> statement-breakpoint
CREATE INDEX "naturalist_bookings_date_of_safari_idx" ON "naturalist_bookings" USING btree ("date_of_safari");--> statement-breakpoint
CREATE INDEX "naturalist_bookings_slot_idx" ON "naturalist_bookings" USING btree ("slot");--> statement-breakpoint
CREATE INDEX "naturalist_bookings_national_park_idx" ON "naturalist_bookings" USING btree ("national_park");--> statement-breakpoint
CREATE INDEX "naturalist_bookings_specialised_interest_idx" ON "naturalist_bookings" USING btree ("specialised_interest");--> statement-breakpoint
CREATE INDEX "naturalist_bookings_name_email_mobile_no_idx" ON "naturalist_bookings" USING btree ("name","email","mobile_no");--> statement-breakpoint
CREATE INDEX "naturalist_bookings_status_idx" ON "naturalist_bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "naturalist_bookings_status_name_email_mobile_no_idx" ON "naturalist_bookings" USING btree ("status","name","email","mobile_no");