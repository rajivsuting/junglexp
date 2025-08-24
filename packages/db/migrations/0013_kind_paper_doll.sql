ALTER TABLE "hotel_safty_features" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "hotel_safty_features" CASCADE;--> statement-breakpoint
ALTER TABLE "safty_features" ADD COLUMN "hotel_id" integer;--> statement-breakpoint
ALTER TABLE "safty_features" ADD CONSTRAINT "safty_features_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE no action ON UPDATE no action;