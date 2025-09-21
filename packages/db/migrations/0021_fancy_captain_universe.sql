ALTER TABLE "souvenir_images" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "souvenir_images" ADD COLUMN "order" integer DEFAULT 0 NOT NULL;