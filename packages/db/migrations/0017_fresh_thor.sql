DROP INDEX "phone_unique";--> statement-breakpoint
DROP INDEX "role_unique";--> statement-breakpoint
CREATE INDEX "phone_unique" ON "users" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "role_unique" ON "users" USING btree ("user_role");