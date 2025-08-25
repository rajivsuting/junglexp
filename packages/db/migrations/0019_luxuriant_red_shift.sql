CREATE TABLE "hotel_faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"faq_id" integer,
	"hotel_id" integer,
	"order" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "faqs" DROP CONSTRAINT "faqs_hotel_id_hotels_id_fk";
--> statement-breakpoint
ALTER TABLE "faqs" DROP CONSTRAINT "faqs_park_id_national_parks_id_fk";
--> statement-breakpoint
DROP INDEX "faqs_unique_hotel";--> statement-breakpoint
DROP INDEX "faqs_unique_park";--> statement-breakpoint
DROP INDEX "faqs_hotel_idx";--> statement-breakpoint
DROP INDEX "faqs_park_idx";--> statement-breakpoint
ALTER TABLE "hotel_faqs" ADD CONSTRAINT "hotel_faqs_faq_id_faqs_id_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_faqs" ADD CONSTRAINT "hotel_faqs_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faqs" DROP COLUMN "subject";--> statement-breakpoint
ALTER TABLE "faqs" DROP COLUMN "order";--> statement-breakpoint
ALTER TABLE "faqs" DROP COLUMN "hotel_id";--> statement-breakpoint
ALTER TABLE "faqs" DROP COLUMN "park_id";--> statement-breakpoint
DROP TYPE "public"."faq_subject";