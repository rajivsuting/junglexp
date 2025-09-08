ALTER TABLE "activities" RENAME COLUMN "duration_hours" TO "duration";--> statement-breakpoint
DROP INDEX "activities_location_idx";--> statement-breakpoint
DROP INDEX "activities_rating_idx";--> statement-breakpoint
ALTER TABLE "activities" DROP COLUMN "rating";--> statement-breakpoint
ALTER TABLE "activities" DROP COLUMN "max_participants";--> statement-breakpoint
ALTER TABLE "activities" DROP COLUMN "min_age";--> statement-breakpoint
ALTER TABLE "activities" DROP COLUMN "location";