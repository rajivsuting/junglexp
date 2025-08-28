"use client";

import RoomForm from "./room-form";

import type { TRoom } from "@repo/db/schema/types";

interface RoomViewPageProps {
  pageTitle?: string;
  mode?: "create" | "edit";
  roomId?: string;
  initialData?: TRoom | null;
}

export default function RoomViewPage({
  pageTitle = "Create Room",
  mode = "create",
  roomId,
  initialData,
}: RoomViewPageProps) {
  console.log("initialData", initialData);

  return (
    <RoomForm
      pageTitle={pageTitle}
      mode={mode}
      roomId={roomId}
      initialData={initialData}
    />
  );
}
