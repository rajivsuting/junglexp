import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import ZoneViewPage from "@/features/zones/components/zone-view-page";

type TProps = {
  params: Promise<{ "zone-id": string }>;
};

export default async function ZonePage({ params }: TProps) {
  const { "zone-id": zoneId } = await params;

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <ZoneViewPage zoneId={zoneId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
