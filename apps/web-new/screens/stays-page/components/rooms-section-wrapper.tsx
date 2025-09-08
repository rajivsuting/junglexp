import { getRooms } from '@repo/actions/rooms.actions';

import { RoomsSection } from './rooms-section';

import type { THotel } from "@repo/db/schema/types";
interface RoomsSectionWrapperProps {
  stay: THotel;
}

export async function RoomsSectionWrapper({ stay }: RoomsSectionWrapperProps) {
  console.log("stay", stay.id);

  const { rooms } = await getRooms({
    hotel_id: stay.id,
  });

  return <RoomsSection rooms={rooms} />;
}
