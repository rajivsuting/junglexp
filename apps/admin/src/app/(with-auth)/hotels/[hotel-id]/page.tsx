import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import HotelViewPage from "@/features/hotels/components/hotel-view-page";

type PageProps = { params: Promise<{ "hotel-id": string }> };

const CreateHotel = async (props: PageProps) => {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <HotelViewPage hotelId={params["hotel-id"]} />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default CreateHotel;
