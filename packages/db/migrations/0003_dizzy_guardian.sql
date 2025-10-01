ALTER TABLE "reels" DROP CONSTRAINT "reels_activity_id_activities_id_fk";
--> statement-breakpoint
DROP INDEX "reels_activity_id_idx";--> statement-breakpoint
ALTER TABLE "reels" ADD COLUMN "redirect_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "reels" DROP COLUMN "activity_id";