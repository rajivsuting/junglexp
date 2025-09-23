import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { searchParamsCache } from '@/lib/searchparams';
import { getNaturalists } from '@repo/actions/naturlists.actions';

import { NaturalistsTable } from './table';
import { columns } from './table/columns';

const NaturalistsListing = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
  } as any;

  const { naturalists, total } = await getNaturalists(filters);

  return (
    <NaturalistsTable
      data={naturalists as any}
      totalItems={total}
      columns={columns}
    />
  );
};

export default NaturalistsListing;
