import { searchParamsCache } from "@/lib/searchparams";
import { getRooms } from "@repo/actions/rooms.actions";

import { RoomsTable } from "./components/rooms-table";
import { columns } from "./components/rooms-table/columns";

const RoomsListing = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");
  const hotel = searchParamsCache.get("hotel");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(hotel &&
      hotel.length > 0 && {
        hotel_id: hotel.length === 1 ? Number(hotel[0]) : hotel.map(Number),
      }),
  };

  const { rooms, total } = await getRooms(filters);

  return <RoomsTable data={rooms} totalItems={total} columns={columns} />;
};

export default RoomsListing;
