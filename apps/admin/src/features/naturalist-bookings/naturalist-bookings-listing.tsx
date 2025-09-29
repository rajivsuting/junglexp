import { searchParamsCache } from "@/lib/searchparams";
import { getNaturalistBookings } from "@repo/actions/naturalist-bookings.actions";

import { NaturalistBookingsTable } from "./components/naturalist-bookings-table";
import { columns } from "./components/naturalist-bookings-table/columns";

const NaturalistBookingsListing = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");
  const status = searchParamsCache.get("status");
  const park_id = searchParamsCache.get("park_id");
  const slot = searchParamsCache.get("slot");
  const date_of_safari = searchParamsCache.get("date_of_safari");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(status &&
      Array.isArray(status) &&
      status.length > 0 && {
        status: status[0] as "pending" | "confirmed" | "cancelled",
      }),
    ...(park_id && { park_id: Number(park_id) }),
    ...(slot &&
      Array.isArray(slot) &&
      slot.length > 0 && {
        slot: slot[0],
      }),
    ...(date_of_safari && { date_of_safari }),
  };

  const { naturalistBookings, total } = await getNaturalistBookings(filters);

  return (
    <NaturalistBookingsTable
      data={naturalistBookings}
      totalItems={total}
      columns={columns}
    />
  );
};

export default NaturalistBookingsListing;
