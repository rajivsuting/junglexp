CREATE TABLE "safty_features" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"icon" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hotel_safty_features" RENAME COLUMN "label" TO "hotel_id";--> statement-breakpoint
ALTER TABLE "hotel_safty_features" RENAME COLUMN "icon" TO "safty_feature_id";--> statement-breakpoint
ALTER TABLE "hotel_safty_features" ADD CONSTRAINT "hotel_safty_features_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_safty_features" ADD CONSTRAINT "hotel_safty_features_safty_feature_id_safty_features_id_fk" FOREIGN KEY ("safty_feature_id") REFERENCES "public"."safty_features"("id") ON DELETE cascade ON UPDATE no action;