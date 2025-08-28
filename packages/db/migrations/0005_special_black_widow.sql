CREATE INDEX "hotels_location_idx" ON "hotels" USING btree ("location");--> statement-breakpoint
CREATE INDEX "hotels_name_idx" ON "hotels" USING btree ("name");--> statement-breakpoint
CREATE INDEX "hotels_slug_idx" ON "hotels" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "hotels_zone_id_idx" ON "hotels" USING btree ("zone_id");--> statement-breakpoint
CREATE INDEX "hotels_hotel_type_idx" ON "hotels" USING btree ("hotel_type");--> statement-breakpoint
CREATE INDEX "hotels_rating_idx" ON "hotels" USING btree ("rating");--> statement-breakpoint
CREATE INDEX "hotels_hotel_type_rating_idx" ON "hotels" USING btree ("hotel_type","rating");--> statement-breakpoint
CREATE INDEX "hotels_hotel_type_zone_id_idx" ON "hotels" USING btree ("hotel_type","zone_id");--> statement-breakpoint
CREATE INDEX "places_location_idx" ON "places" USING btree ("location");--> statement-breakpoint
CREATE INDEX "places_name_idx" ON "places" USING btree ("name");--> statement-breakpoint
CREATE INDEX "places_slug_idx" ON "places" USING btree ("slug");