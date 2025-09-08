"use client";
import type { TRoom } from "@repo/db/schema/types";

import { RoomCard } from './room-card';

interface RoomsSectionProps {
  rooms: TRoom[];
}

export function RoomsSection({ rooms }: RoomsSectionProps) {
  const handleReserve = (room: TRoom) => {
    console.log("Reserved room:", room.id);
    // You can add your reservation logic here
  };

  return (
    <section className="py-8 text-primary">
      <div className="mb-8">
        <div className="rounded-t-2xl">
          <h2 className="text-xl font-semibold text-primary">Select Room</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onReserve={() => handleReserve(room)}
          />
        ))}
      </div>
    </section>
  );
}
