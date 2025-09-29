CREATE TABLE "naturalist_bookings_new" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"mobile_no" text NOT NULL,
	"date_of_safari" date NOT NULL,
	"slot" text NOT NULL,
	"park_id" integer,
	"specialised_interest" text NOT NULL,
	"status" "naturalist_booking_status" DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
DROP TABLE "naturalist_bookings" CASCADE;--> statement-breakpoint
ALTER TABLE "naturalist_bookings_new" ADD CONSTRAINT "naturalist_bookings_new_park_id_national_parks_id_fk" FOREIGN KEY ("park_id") REFERENCES "public"."national_parks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "naturalist_bookings_park_id_date_of_safari_idx" ON "naturalist_bookings_new" USING btree ("park_id","date_of_safari");--> statement-breakpoint
CREATE INDEX "naturalist_bookings_slot_idx" ON "naturalist_bookings_new" USING btree ("slot");--> statement-breakpoint
CREATE INDEX "naturalist_bookings_specialised_interest_idx" ON "naturalist_bookings_new" USING btree ("specialised_interest");--> statement-breakpoint
CREATE INDEX "naturalist_bookings_name_email_mobile_no_idx" ON "naturalist_bookings_new" USING btree ("name","email","mobile_no");--> statement-breakpoint
CREATE INDEX "naturalist_bookings_status_idx" ON "naturalist_bookings_new" USING btree ("status");--> statement-breakpoint
CREATE INDEX "naturalist_bookings_status_name_email_mobile_no_idx" ON "naturalist_bookings_new" USING btree ("status","name","email","mobile_no");--> statement-breakpoint
CREATE INDEX "naturalist_bookings_park_id_idx" ON "naturalist_bookings_new" USING btree ("park_id");