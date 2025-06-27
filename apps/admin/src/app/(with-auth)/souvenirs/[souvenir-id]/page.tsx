import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import SouvenirViewPage from "@/features/souvenirs/souvenir-view-page";

type PageProps = { params: Promise<{ "souvenir-id": string }> };

const CreateDestination = async (props: PageProps) => {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <SouvenirViewPage souvenirId={params["souvenir-id"]} />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default CreateDestination;
