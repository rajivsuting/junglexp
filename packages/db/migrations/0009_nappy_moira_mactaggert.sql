CREATE TABLE "activity_policies" (
	"id" serial PRIMARY KEY NOT NULL,
	"activity_id" integer,
	"policy_id" integer,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity_policies" ADD CONSTRAINT "activity_policies_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_policies" ADD CONSTRAINT "activity_policies_policy_id_policies_id_fk" FOREIGN KEY ("policy_id") REFERENCES "public"."policies"("id") ON DELETE cascade ON UPDATE no action;