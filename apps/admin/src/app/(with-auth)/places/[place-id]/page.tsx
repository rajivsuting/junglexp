import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import PlaceViewPage from "@/features/places/components/place-view-page";

interface EditPlacePageProps {
  params: Promise<{ "place-id": string }>;
}

const EditPlacePage = async ({ params }: EditPlacePageProps) => {
  const { "place-id": placeId } = await params;

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <PlaceViewPage
            pageTitle={placeId !== "new" ? `Edit Place` : "Create Place"}
            mode={placeId !== "new" ? "edit" : "create"}
            placeId={placeId}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default EditPlacePage;
