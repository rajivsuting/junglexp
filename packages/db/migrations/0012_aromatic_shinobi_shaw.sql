CREATE TABLE "blog_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "category_id" integer NOT NULL;--> statement-breakpoint
CREATE INDEX "blog_categories_slug_idx" ON "blog_categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "blog_categories_name_idx" ON "blog_categories" USING btree ("name");--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_category_id_blog_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "blogs_category_id_idx" ON "blogs" USING btree ("category_id");