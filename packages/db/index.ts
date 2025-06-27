import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

import { Cities } from "./schema/city";
import { Images } from "./schema/image";
import { NationalParks } from "./schema/park";
import * as relations from "./schema/relations";
import { SouvenirImages, Souvenirs } from "./schema/souvenirs";
import { States } from "./schema/state";
import { Users } from "./schema/user";

export * from "drizzle-orm";
export { nationaParkInsertSchema } from "./schema/park";
export type { TUser, TNewUser } from "./schema/user";
export type { TNationalPark, TNewNationalPark } from "./schema/park";
export type { TState, TNewState } from "./schema/state";
export type { TCity, TNewCity } from "./schema/city";
export * from "./schema/types";

export const schemaWithoutRelations = {
  Users,
  NationalParks,
  States,
  Cities,
  Images,
  Souvenirs,
  SouvenirImages,
};

export const schema = {
  ...schemaWithoutRelations,
  ...relations,
};

config({ path: "../../.env.local" });

export const db = drizzle(process.env.DATABASE_URL!, { schema });
