import { Suspense } from 'react';

import PageContainer from '@/components/layout/page-container';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import NaturalistsListing from '@/features/naturalists/naturalists-listing';
import { searchParamsCache } from '@/lib/searchparams';

import type { SearchParams } from "nuqs/server";

type TSearchParams = {
  searchParams: Promise<SearchParams>;
};

const NaturalistsPage = async (props: TSearchParams) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-center justify-between px-1">
          <h1 className="text-2xl font-bold">Naturalists</h1>
          <Skeleton className="h-8 w-[7rem]" />
        </div>
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
          }
        >
          <NaturalistsListing />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default NaturalistsPage;
