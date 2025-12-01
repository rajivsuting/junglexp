ALTER TABLE "blogs" DROP CONSTRAINT "blogs_category_id_blog_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_category_id_blog_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_categories" ADD CONSTRAINT "blog_categories_name_unique" UNIQUE("name");