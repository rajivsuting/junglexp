CREATE TABLE "images" (
	"id" serial PRIMARY KEY NOT NULL,
	"small_url" text NOT NULL,
	"medium_url" text NOT NULL,
	"large_url" text NOT NULL,
	"original_url" text NOT NULL,
	"created_at" timestamp (0) DEFAULT now(),
	"updated_at" timestamp (0) DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "souvenirs" RENAME COLUMN "image_url" TO "slug";--> statement-breakpoint
DROP INDEX "park_name_idx";--> statement-breakpoint
DROP INDEX "park_id_idx";--> statement-breakpoint
DROP INDEX "is_available_idx";--> statement-breakpoint
DROP INDEX "name_availability_idx";--> statement-breakpoint
ALTER TABLE "souvenirs" ADD COLUMN "image_id" integer;--> statement-breakpoint
ALTER TABLE "souvenirs" ADD CONSTRAINT "souvenirs_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "souvenirs_name_idx" ON "souvenirs" USING btree ("name");--> statement-breakpoint
CREATE INDEX "souvenirs_id_idx" ON "souvenirs" USING btree ("park_id");--> statement-breakpoint
CREATE INDEX "souvenirs_slug_idx" ON "souvenirs" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "souvenirs_is_available_idx" ON "souvenirs" USING btree ("is_available");--> statement-breakpoint
CREATE INDEX "souvenirs_name_availability_idx" ON "souvenirs" USING btree ("name","is_available");--> statement-breakpoint
ALTER TABLE "souvenirs" ADD CONSTRAINT "souvenirs_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "souvenirs" ADD CONSTRAINT "souvenirs_slug_unique" UNIQUE("slug");