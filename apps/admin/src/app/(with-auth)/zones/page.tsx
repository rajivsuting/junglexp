import { Suspense } from 'react';

import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import NationalParkViewPage from '@/features/national-parks/components/national-park-view-page';
import NationalParksListing from '@/features/national-parks/national-parks-listing';
import ZonesListing from '@/features/zones/zones-listing';
import { searchParamsCache } from '@/lib/searchparams';

import type { SearchParams } from "nuqs/server";
type PageProps = {
  searchParams: Promise<SearchParams>;
};
const Zones = async (props: PageProps) => {
  const searchParams = await props.searchParams;

  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
          }
        >
          <ZonesListing />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default Zones;
