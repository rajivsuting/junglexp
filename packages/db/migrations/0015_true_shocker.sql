CREATE TABLE "hotel_safty_features" (
	"id" serial PRIMARY KEY NOT NULL,
	"safty_feature_id" integer,
	"hotel_id" integer
);
--> statement-breakpoint
CREATE TABLE "policies" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" "policy_kind" NOT NULL,
	"label" text NOT NULL,
	"hotel_id" integer NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hotel_policies" DROP CONSTRAINT "hotel_policies_hotel_id_hotels_id_fk";
--> statement-breakpoint
ALTER TABLE "safty_features" DROP CONSTRAINT "safty_features_hotel_id_hotels_id_fk";
--> statement-breakpoint
DROP INDEX "hotel_policies_kind_idx";--> statement-breakpoint
DROP INDEX "hotel_policies_label_idx";--> statement-breakpoint
ALTER TABLE "hotel_policies" ALTER COLUMN "hotel_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "hotel_policies" ADD COLUMN "policy_id" integer;--> statement-breakpoint
ALTER TABLE "hotel_safty_features" ADD CONSTRAINT "hotel_safty_features_safty_feature_id_safty_features_id_fk" FOREIGN KEY ("safty_feature_id") REFERENCES "public"."safty_features"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_safty_features" ADD CONSTRAINT "hotel_safty_features_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policies" ADD CONSTRAINT "policies_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "hotel_policies_kind_idx" ON "policies" USING btree ("kind");--> statement-breakpoint
CREATE INDEX "hotel_policies_label_idx" ON "policies" USING btree ("label");--> statement-breakpoint
ALTER TABLE "hotel_policies" ADD CONSTRAINT "hotel_policies_policy_id_policies_id_fk" FOREIGN KEY ("policy_id") REFERENCES "public"."policies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_policies" ADD CONSTRAINT "hotel_policies_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_policies" DROP COLUMN "kind";--> statement-breakpoint
ALTER TABLE "hotel_policies" DROP COLUMN "label";--> statement-breakpoint
ALTER TABLE "hotel_policies" DROP COLUMN "order";--> statement-breakpoint
ALTER TABLE "safty_features" DROP COLUMN "hotel_id";