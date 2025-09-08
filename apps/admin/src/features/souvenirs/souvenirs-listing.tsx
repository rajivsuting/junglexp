import { log } from 'console';

import { searchParamsCache } from '@/lib/searchparams';
import { getSouvenirs } from '@repo/actions/souvenirs.actions';

import { SouvenirsTable } from './components/souvenirs-table';
import { columns } from './components/souvenirs-table/columns';

import type { TGetSouvenirsFilters } from "@repo/actions/souvenirs.actions";
const SouvenirsListing = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const availability = searchParamsCache.get("availability");
  const park = searchParamsCache.get("park");
  const pageLimit = searchParamsCache.get("perPage");

  // const filters: TGetSouvenirsFilters = {
  //   page,
  //   limit: pageLimit,
  //   ...(search && { search }),
  //   ...(availability && { availability }),
  //   ...(park && { park }),
  // };

  // const { data, total } = await getSouvenirs(filters);

  // console.log("data", data);
  // return <SouvenirsTable data={data} totalItems={total} columns={columns} />;
  return null;
};

export default SouvenirsListing;
