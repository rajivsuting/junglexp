ALTER TABLE "souvenirs" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
CREATE INDEX "park_name_idx" ON "souvenirs" USING btree ("name");--> statement-breakpoint
CREATE INDEX "park_id_idx" ON "souvenirs" USING btree ("park_id");--> statement-breakpoint
CREATE INDEX "is_available_idx" ON "souvenirs" USING btree ("is_available");--> statement-breakpoint
CREATE INDEX "name_availability_idx" ON "souvenirs" USING btree ("name","is_available");