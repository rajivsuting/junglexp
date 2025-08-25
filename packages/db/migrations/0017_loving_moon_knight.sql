ALTER TABLE "hotel_amenities" ADD COLUMN "order" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "amenities" DROP COLUMN "order";