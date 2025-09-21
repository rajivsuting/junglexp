CREATE UNIQUE INDEX "email_unique" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "phone_unique" ON "users" USING btree ("phone");--> statement-breakpoint
CREATE UNIQUE INDEX "role_unique" ON "users" USING btree ("role");