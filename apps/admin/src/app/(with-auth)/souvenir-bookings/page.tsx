import { Suspense } from "react";

import PageContainer from "@/components/layout/page-container";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import SouvenirBookingsListing from "@/features/souvenir-bookings/souvenir-bookings-listing";
import { searchParamsCache } from "@/lib/searchparams";

import type { SearchParams } from "nuqs/server";

type TSearchParams = {
  searchParams: Promise<SearchParams>;
};

export default async function SouvenirBookingsPage(props: TSearchParams) {
  const searchParams = await props.searchParams;

  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={8} rowCount={8} filterCount={3} />
          }
        >
          <SouvenirBookingsListing />
        </Suspense>
      </div>
    </PageContainer>
  );
}
