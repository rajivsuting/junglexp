CREATE TABLE "naturalist" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image_id" integer,
	"description" text NOT NULL,
	"park_id" integer
);
--> statement-breakpoint
ALTER TABLE "naturalist" ADD CONSTRAINT "naturalist_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "naturalist" ADD CONSTRAINT "naturalist_park_id_national_parks_id_fk" FOREIGN KEY ("park_id") REFERENCES "public"."national_parks"("id") ON DELETE no action ON UPDATE no action;