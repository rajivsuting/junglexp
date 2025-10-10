CREATE TABLE "naturalist_activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"naturalist_id" integer,
	"activity_id" integer
);
--> statement-breakpoint
ALTER TABLE "naturalist" DROP CONSTRAINT "naturalist_activity_ids_activities_id_fk";
--> statement-breakpoint
ALTER TABLE "naturalist_activities" ADD CONSTRAINT "naturalist_activities_naturalist_id_naturalist_id_fk" FOREIGN KEY ("naturalist_id") REFERENCES "public"."naturalist"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "naturalist_activities" ADD CONSTRAINT "naturalist_activities_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "naturalist" DROP COLUMN "activity_ids";