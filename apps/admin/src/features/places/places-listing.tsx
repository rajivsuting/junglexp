import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { searchParamsCache } from "@/lib/searchparams";
import { getPlaces } from "@repo/actions/places.actions";

import { PlacesTable } from "./components/places-table";
import { columns } from "./components/places-table/columns";

const PlacesListing = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
  };

  const { places, total } = await getPlaces(filters);

  return <PlacesTable data={places} totalItems={total} columns={columns} />;
};

export default PlacesListing;
