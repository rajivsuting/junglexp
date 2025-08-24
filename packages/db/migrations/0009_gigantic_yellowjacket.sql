ALTER TABLE "faqs" RENAME COLUMN "subject_id" TO "hotel_id";--> statement-breakpoint
ALTER TABLE "faqs" DROP CONSTRAINT "faqs_subject_id_hotels_id_fk";
--> statement-breakpoint
DROP INDEX "faqs_subject_idx";--> statement-breakpoint
DROP INDEX "faqs_unique_subject_question";--> statement-breakpoint
ALTER TABLE "faqs" ADD COLUMN "park_id" integer;--> statement-breakpoint
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_park_id_national_parks_id_fk" FOREIGN KEY ("park_id") REFERENCES "public"."national_parks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "faqs_unique_hotel" ON "faqs" USING btree ("hotel_id","question");--> statement-breakpoint
CREATE UNIQUE INDEX "faqs_unique_park" ON "faqs" USING btree ("park_id","question");--> statement-breakpoint
CREATE INDEX "faqs_hotel_idx" ON "faqs" USING btree ("hotel_id","order");--> statement-breakpoint
CREATE INDEX "faqs_park_idx" ON "faqs" USING btree ("park_id","order");