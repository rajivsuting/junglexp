CREATE TABLE "souvenirs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL,
	"price" integer NOT NULL,
	"park_id" integer,
	"is_available" boolean DEFAULT false NOT NULL,
	"created_at" timestamp (0) DEFAULT now(),
	"updated_at" timestamp (0) DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "souvenirs" ADD CONSTRAINT "souvenirs_park_id_national_parks_id_fk" FOREIGN KEY ("park_id") REFERENCES "public"."national_parks"("id") ON DELETE no action ON UPDATE no action;