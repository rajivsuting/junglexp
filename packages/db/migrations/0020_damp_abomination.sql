CREATE TYPE "public"."hotel_status" AS ENUM('active', 'inactive');--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "status" "hotel_status" DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "is_featured" boolean DEFAULT false;--> statement-breakpoint
CREATE INDEX "hotels_is_featured_idx" ON "hotels" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "hotels_is_featured_hotel_type_idx" ON "hotels" USING btree ("is_featured","hotel_type");--> statement-breakpoint
CREATE INDEX "hotels_is_featured_hotel_type_zone_id_idx" ON "hotels" USING btree ("is_featured","hotel_type","zone_id");--> statement-breakpoint
CREATE INDEX "hotels_is_featured_hotel_type_rating_idx" ON "hotels" USING btree ("is_featured","hotel_type","rating");--> statement-breakpoint
CREATE INDEX "hotels_is_featured_hotel_type_zone_id_rating_idx" ON "hotels" USING btree ("is_featured","hotel_type","zone_id","rating");--> statement-breakpoint
CREATE INDEX "hotels_status_idx" ON "hotels" USING btree ("status");--> statement-breakpoint
CREATE INDEX "hotels_hotels_status_hotel_type_idx" ON "hotels" USING btree ("status","hotel_type");--> statement-breakpoint
CREATE INDEX "hotels_hotels_status_hotel_type_zone_id_idx" ON "hotels" USING btree ("status","hotel_type","zone_id");--> statement-breakpoint
CREATE INDEX "hotels_hotels_status_hotel_type_rating_idx" ON "hotels" USING btree ("status","hotel_type","rating");--> statement-breakpoint
CREATE INDEX "hotels_hotels_status_hotel_type_zone_id_rating_idx" ON "hotels" USING btree ("status","hotel_type","zone_id","rating");--> statement-breakpoint
CREATE INDEX "hotels_hotels_status_is_featured_hotel_type_zone_id_rating_idx" ON "hotels" USING btree ("status","is_featured","hotel_type","zone_id","rating");