CREATE TABLE "souvenir_images" (
	"souvenir_id" integer NOT NULL,
	"image_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "souvenirs" DROP CONSTRAINT "souvenirs_image_ids_images_id_fk";
--> statement-breakpoint
ALTER TABLE "souvenir_images" ADD CONSTRAINT "souvenir_images_souvenir_id_souvenirs_id_fk" FOREIGN KEY ("souvenir_id") REFERENCES "public"."souvenirs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "souvenir_images" ADD CONSTRAINT "souvenir_images_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "souvenirs" DROP COLUMN "image_ids";