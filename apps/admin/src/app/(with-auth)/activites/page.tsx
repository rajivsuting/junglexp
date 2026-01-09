import { Suspense } from "react";

import PageContainer from "@/components/layout/page-container";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import ActivitiesListing from "@/features/activities/activities-listing";
import { searchParamsCache } from "@/lib/searchparams";

import type { SearchParams } from "nuqs/server";

const Activities = async (props: PageProps<"/activites">) => {
  const searchParams = (await props.searchParams) as SearchParams;

  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
          }
        >
          <ActivitiesListing />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default Activities;
