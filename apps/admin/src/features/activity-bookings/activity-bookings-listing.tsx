import { searchParamsCache } from '@/lib/searchparams';
import { getActivityBookings } from '@repo/actions/activity-bookings.actions';

import { ActivityBookingsTable } from './components/activity-bookings-table';
import { columns } from './components/activity-bookings-table/columns';

const ActivityBookingsListing = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");
  const status = searchParamsCache.get("status");
  const activity_id = searchParamsCache.get("activity_id");
  const preferredDate = searchParamsCache.get("preferred_date");
  const sort = searchParamsCache.get("sort");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(status &&
      Array.isArray(status) &&
      status.length > 0 && {
        status: status as ("pending" | "confirmed" | "cancelled")[],
      }),
    ...(activity_id && { activity_id: Number(activity_id) }),
    ...(preferredDate && { preferredDate }),
  };

  const { activityBookings, total } = await getActivityBookings(
    filters as any,
    sort || []
  );

  return (
    <ActivityBookingsTable
      data={activityBookings}
      totalItems={total}
      columns={columns}
    />
  );
};

export default ActivityBookingsListing;
