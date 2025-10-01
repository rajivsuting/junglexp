import { columns } from '@/features/reels/components/reels-table/columns';
import { ReelsTable } from '@/features/reels/components/reels-table/index';
import { searchParamsCache } from '@/lib/searchparams';
import { getReels } from '@repo/actions/reels.actions';

const ReelsListing = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("title");
  const pageLimit = searchParamsCache.get("perPage");
  const status = searchParamsCache.get("status");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(status &&
      Array.isArray(status) &&
      status.length > 0 && { status: status[0] as any }),
    // activity filter not wired via searchparams yet
  };

  const { reels, total } = await getReels(filters as any);

  return (
    <ReelsTable
      data={reels as any}
      totalItems={total}
      columns={columns as any}
    />
  );
};

export default ReelsListing;
