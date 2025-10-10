import {
  createSearchParamsCache,
  createSerializer,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsJson,
  parseAsString,
} from "nuqs/server";
import z from "zod";

const schema = z.object({
  id: z.string(),
  desc: z.boolean(),
});

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString,
  availability: parseAsBoolean,
  park: parseAsString,
  hotel: parseAsString,
  role: parseAsString,
  status: parseAsArrayOf(parseAsString),
  is_featured: parseAsArrayOf(parseAsString),
  // Hotel booking filters
  hotel_id: parseAsInteger,
  room_id: parseAsInteger,
  from_date: parseAsString,
  to_date: parseAsString,
  // Naturalist booking filters
  park_id: parseAsInteger,
  slot: parseAsArrayOf(parseAsString),
  date_of_safari: parseAsString,
  check_in_date: parseAsString,
  check_out_date: parseAsString,
  sort: parseAsArrayOf(parseAsJson(schema)),
  activity_id: parseAsInteger,
  title: parseAsString,
  souvenir_id: parseAsInteger,
  preferred_date: parseAsString,
  // advanced filter
  // filters: getFiltersStateParser().withDefault([]),
  // joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and')
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
