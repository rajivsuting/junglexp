ALTER TABLE "hotels" ADD COLUMN "location" geometry(point) NOT NULL;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN "location" geometry(point) NOT NULL;