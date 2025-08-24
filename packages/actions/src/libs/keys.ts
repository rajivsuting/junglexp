import { getVersion } from "./cache";

export async function activePromotionsKey(): Promise<string> {
  const v = await getVersion("promotions");
  return `promotions:active:v${v}`;
}

export async function inactivePromotionsKey(): Promise<string> {
  const v = await getVersion("promotions");
  return `promotions:inactive:v${v}`;
}

export async function promotionKey(id: number): Promise<string> {
  const v = await getVersion("promotions");
  return `promotions:${id}:v${v}`;
}

export const nationalParkBySlugKey = (slug: string) =>
  `national-park-by-slug-${slug}`;
