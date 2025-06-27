ALTER TABLE "destinations" RENAME TO "national_parks";--> statement-breakpoint
ALTER TABLE "national_parks" DROP CONSTRAINT "destinations_slug_unique";--> statement-breakpoint
ALTER TABLE "national_parks" DROP CONSTRAINT "destinations_city_id_cities_id_fk";
--> statement-breakpoint
ALTER TABLE "national_parks" ADD CONSTRAINT "national_parks_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "national_parks" ADD CONSTRAINT "national_parks_slug_unique" UNIQUE("slug");