CREATE TABLE "amenities" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"icon" text NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hotel_amenities" ADD COLUMN "amenity_id" integer;--> statement-breakpoint
ALTER TABLE "hotel_amenities" ADD CONSTRAINT "hotel_amenities_amenity_id_amenities_id_fk" FOREIGN KEY ("amenity_id") REFERENCES "public"."amenities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_amenities" DROP COLUMN "label";--> statement-breakpoint
ALTER TABLE "hotel_amenities" DROP COLUMN "icon";--> statement-breakpoint
ALTER TABLE "hotel_amenities" DROP COLUMN "order";