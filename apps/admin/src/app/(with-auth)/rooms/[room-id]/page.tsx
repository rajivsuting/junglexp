import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import RoomViewPage from "@/features/rooms/components/room-view-page";
import { getRoomById } from "@repo/actions/rooms.actions";

interface RoomPageProps {
  params: Promise<{ "room-id": string }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { "room-id": roomId } = await params;
  const room = await getRoomById(Number(roomId));

  if (!room) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Room Not Found</h1>
          <p className="text-muted-foreground">
            The room you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <RoomViewPage
            pageTitle={`Edit Room: ${room.name}`}
            mode="edit"
            roomId={roomId}
            initialData={room}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}
