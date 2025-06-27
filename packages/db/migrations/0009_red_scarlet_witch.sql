ALTER TABLE "souvenirs" RENAME COLUMN "image_id" TO "image_ids";--> statement-breakpoint
ALTER TABLE "souvenirs" DROP CONSTRAINT "souvenirs_image_id_images_id_fk";
--> statement-breakpoint
ALTER TABLE "souvenirs" ADD CONSTRAINT "souvenirs_image_ids_images_id_fk" FOREIGN KEY ("image_ids") REFERENCES "public"."images"("id") ON DELETE no action ON UPDATE no action;