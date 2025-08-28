import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import RoomViewPage from "@/features/rooms/components/room-view-page";

export default function CreateRoomPage() {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <RoomViewPage pageTitle="Create New Room" mode="create" />
        </Suspense>
      </div>
    </PageContainer>
  );
}
