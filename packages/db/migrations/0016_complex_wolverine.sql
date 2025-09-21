DROP INDEX "role_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user_role" "user_roles" DEFAULT 'user' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "role_unique" ON "users" USING btree ("user_role");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "role";