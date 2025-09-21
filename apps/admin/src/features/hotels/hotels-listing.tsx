import { searchParamsCache } from "@/lib/searchparams";
import { getHotels } from "@repo/actions/hotels.actions";

import { HotlesTable } from "./components/hotels-table";
import { columns } from "./components/hotels-table/columns";

const NationalParksListing = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");
  const status = searchParamsCache.get("status");
  const is_featured = searchParamsCache.get("is_featured");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(status && { status }),
    ...(is_featured && { is_featured }),
  };

  const { hotels, total } = await getHotels(filters);

  return <HotlesTable data={hotels} totalItems={total} columns={columns} />;
};

export default NationalParksListing;
