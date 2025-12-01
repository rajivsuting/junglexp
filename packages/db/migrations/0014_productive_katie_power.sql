CREATE TYPE "public"."activity_date_type" AS ENUM('predefined', 'any');--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN "date_type" "activity_date_type" DEFAULT 'predefined' NOT NULL;