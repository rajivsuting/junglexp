import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import PlaceForm from "@/features/places/components/place-form";

const NewPlace = async () => {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <PlaceForm initialData={null} pageTitle="Create New Place" />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default NewPlace;
