ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."user_roles";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user';