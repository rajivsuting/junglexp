import { searchParamsCache } from "@/lib/searchparams";
import { getUsers } from "@repo/actions/users.actions";

import { UsersTable } from "./components/users-table";

const UsersListing = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");
  const role = searchParamsCache.get("role");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(role && { role: role as any }),
  };

  const { users, total } = await getUsers(filters);

  return <UsersTable data={users} totalItems={total} />;
};

export default UsersListing;
