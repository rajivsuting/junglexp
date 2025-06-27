import { searchParamsCache } from "@/lib/searchparams";
import { getSouvenirs } from "@repo/actions/souvenirs.actions";

import { columns } from "../souvenirs/components/souvenirs-table/columns";
import { SouvenirsTable } from "./components/tours-table";

import type { TGetSouvenirsFilters } from "@repo/actions/souvenirs.actions";
const ToursListing = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const availability = searchParamsCache.get("availability");
  const park = searchParamsCache.get("park");
  const pageLimit = searchParamsCache.get("perPage");

  const filters: TGetSouvenirsFilters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(availability && { availability }),
    ...(park && { park }),
  };

  const { data, total } = await getSouvenirs(filters);

  return <SouvenirsTable data={data} totalItems={total} columns={columns} />;
};

export default ToursListing;
