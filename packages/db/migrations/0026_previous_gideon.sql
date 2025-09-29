ALTER TABLE "naturalist_bookings" RENAME COLUMN "national_park" TO "park_id";--> statement-breakpoint
ALTER TABLE "naturalist_bookings" DROP CONSTRAINT "naturalist_bookings_hotel_id_hotels_id_fk";
--> statement-breakpoint
DROP INDEX "naturalist_bookings_date_of_safari_idx";--> statement-breakpoint
DROP INDEX "naturalist_bookings_national_park_idx";--> statement-breakpoint
DROP INDEX "naturalist_bookings_hotel_id_idx";--> statement-breakpoint
ALTER TABLE "naturalist_bookings" ADD CONSTRAINT "naturalist_bookings_park_id_national_parks_id_fk" FOREIGN KEY ("park_id") REFERENCES "public"."national_parks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "naturalist_bookings_park_id_date_of_safari_idx" ON "naturalist_bookings" USING btree ("park_id","date_of_safari");--> statement-breakpoint
CREATE INDEX "naturalist_bookings_park_id_idx" ON "naturalist_bookings" USING btree ("park_id");--> statement-breakpoint
ALTER TABLE "naturalist_bookings" DROP COLUMN "hotel_id";