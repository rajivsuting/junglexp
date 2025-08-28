import { Suspense } from "react";

import PageContainer from "@/components/layout/page-container";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import RoomsListing from "@/features/rooms/rooms-listing";
import { searchParamsCache } from "@/lib/searchparams";

import type { SearchParams } from "nuqs/server";

type TSearchParams = {
  searchParams: Promise<SearchParams>;
};

const Rooms = async (props: TSearchParams) => {
  const searchParams = await props.searchParams;

  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={6} rowCount={8} filterCount={2} />
          }
        >
          <RoomsListing />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default Rooms;
