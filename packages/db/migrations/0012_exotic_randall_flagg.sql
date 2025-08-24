ALTER TABLE "policies" DROP CONSTRAINT "policies_hotel_id_hotels_id_fk";
--> statement-breakpoint
ALTER TABLE "hotel_images" ADD COLUMN "order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "policies" DROP COLUMN "hotel_id";