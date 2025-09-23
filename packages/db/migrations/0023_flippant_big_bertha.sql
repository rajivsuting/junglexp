CREATE INDEX "naturalist_park_id_index" ON "naturalist" USING btree ("park_id");--> statement-breakpoint
CREATE INDEX "naturalist_name_index" ON "naturalist" USING btree ("name");--> statement-breakpoint
CREATE INDEX "naturalist_park_id_name_index" ON "naturalist" USING btree ("park_id","name");