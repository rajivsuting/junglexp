CREATE TYPE "public"."activity_booking_status" AS ENUM('pending', 'confirmed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."souvenir_booking_status" AS ENUM('pending', 'confirmed', 'cancelled');--> statement-breakpoint
CREATE TABLE "activity_bookings" (
	"booking_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"mobile" text NOT NULL,
	"email" text NOT NULL,
	"preferred_date" date NOT NULL,
	"number_of_adults" integer NOT NULL,
	"number_of_kids" integer NOT NULL,
	"message" text,
	"status" "activity_booking_status" DEFAULT 'pending' NOT NULL,
	"activity_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "souvenir_bookings" (
	"booking_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"mobile" text NOT NULL,
	"email" text NOT NULL,
	"souvenir_id" integer NOT NULL,
	"rate" integer NOT NULL,
	"quantity" integer NOT NULL,
	"message" text,
	"status" "souvenir_booking_status" DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity_bookings" ADD CONSTRAINT "activity_bookings_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "souvenir_bookings" ADD CONSTRAINT "souvenir_bookings_souvenir_id_souvenirs_id_fk" FOREIGN KEY ("souvenir_id") REFERENCES "public"."souvenirs"("id") ON DELETE cascade ON UPDATE no action;