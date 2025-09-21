import {
  bigint,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoles = pgEnum("user_roles", ["user", "admin", "super_admin"]);

export const Users = pgTable(
  "users",
  {
    id: bigint("id", { mode: "bigint" })
      .primaryKey()
      .generatedByDefaultAsIdentity(),
    user_id: text("user_id").notNull().unique(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    phone: varchar("phone", { length: 255 }).unique(),
    first_name: varchar("first_name", { length: 225 }).notNull(),
    last_name: varchar("last_name", { length: 225 }).notNull(),
    user_role: userRoles("user_role").notNull().default("user"),
    created_at: timestamp("created_at", { precision: 0 })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { precision: 0 })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("user_id_unique").on(table.user_id),
    uniqueIndex("email_unique").on(table.email),
    index("phone_unique").on(table.phone),
    index("role_unique").on(table.user_role),
  ]
);

export type TNewUser = typeof Users.$inferInsert;
export type TUser = Omit<typeof Users.$inferSelect, "id"> & {
  id: number;
};
