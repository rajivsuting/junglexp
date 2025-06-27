import { db, schemaWithoutRelations } from "@repo/db";

import { Souvenirs } from "../../db/schema/souvenirs";

export const getServerSideExistingSlugs = async (
  table: keyof typeof schemaWithoutRelations,
  field: string,
  value: string
) => {
  const existingSlugsSet = new Set(
    (
      await db.select({ slug: Souvenirs.slug }).from().where(eq(field, value))
    ).map((s) => s.slug)
  );

  return existingSlugsSet;
};
