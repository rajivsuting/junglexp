import { searchParamsCache } from "@/lib/searchparams";
import { getSouvenirBookings } from "@repo/actions/souvenir-bookings.actions";

import { SouvenirBookingsTable } from "./components/souvenir-bookings-table";
import { columns } from "./components/souvenir-bookings-table/columns";

const SouvenirBookingsListing = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");
  const status = searchParamsCache.get("status");
  const souvenir_id = searchParamsCache.get("souvenir_id");
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
    ...(souvenir_id && { souvenir_id: Number(souvenir_id) }),
  };

  const { souvenirBookings, total } = await getSouvenirBookings(
    filters as any,
    sort || []
  );

  return (
    <SouvenirBookingsTable
      data={souvenirBookings}
      totalItems={total}
      columns={columns}
    />
  );
};

export default SouvenirBookingsListing;
