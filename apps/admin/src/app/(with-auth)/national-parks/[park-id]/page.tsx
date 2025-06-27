import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import NationalParkViewPage from "@/features/national-parks/components/national-park-view-page";

type PageProps = { params: Promise<{ "park-id": string }> };

const CreateDestination = async (props: PageProps) => {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <NationalParkViewPage parkId={params["park-id"]} />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default CreateDestination;
