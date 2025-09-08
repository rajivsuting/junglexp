import { searchParamsCache } from '@/lib/searchparams';
import { getActivities } from '@repo/actions/activities.actions';

import { ActivitiesTable } from './components/activities-table';
import { columns } from './components/activities-table/columns';

import type { TGetActivitiesFilters } from "@repo/actions/activities.actions";
import type { TActivity } from "@repo/db/index";

const ActivitiesListing = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const park = searchParamsCache.get("park");
  const pageLimit = searchParamsCache.get("perPage");

  const filters: TGetActivitiesFilters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(park && { park_id: Number(park) }),
  };

  const { activities, total } = await getActivities(filters);

  return (
    <ActivitiesTable<TActivity, unknown>
      data={activities}
      totalItems={total}
      columns={columns}
    />
  );
};

export default ActivitiesListing;
