import { searchParamsCache } from "@/lib/searchparams";
import { getNationalParks } from "@repo/actions/parks.actions";

import { NationalParkTable } from "./components/national-park-table";
import { columns } from "./components/national-park-table/columns";

const NationalParksListing = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
  };

  const { parks, total } = await getNationalParks(filters);

  return (
    <NationalParkTable data={parks} totalItems={total} columns={columns} />
  );
};

export default NationalParksListing;
