import { use } from 'react';

import { searchParamsCache } from '@/lib/searchparams';
import { getNationalParks } from '@repo/actions/parks.actions';
import { getZones } from '@repo/actions/zones.actions';

import { ZonesTable } from './components/zones-table';
import { columns } from './components/zones-table/columns';

const ZonesListing = async () => {
  const park = searchParamsCache.get("park");
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(park && { park: Number(park) }),
  };

  const { zones, total } = await getZones(filters);

  return <ZonesTable data={zones} totalItems={total} columns={columns} />;
};

export default ZonesListing;
