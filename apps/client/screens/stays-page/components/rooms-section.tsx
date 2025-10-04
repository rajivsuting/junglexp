"use client";
import type { THotel, TRoom, TRoomPlan } from "@repo/db/schema/types";

import { useState } from "react";

import { BookingModal } from "@/components/booking-modal";

import { RoomCard } from "./room-card";

import type { THotelBase } from "@repo/db/schema/hotels";

interface RoomsSectionProps {
  stay: THotel;
}

export function RoomsSection({ stay }: RoomsSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<TRoom | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<TRoomPlan | null>(null);

  const { rooms } = stay;
  const handleReserve = (room: TRoom, plan: TRoomPlan) => {
    setSelectedRoom(room);
    setSelectedPlan(plan);
    setIsOpen(true);
    // You can add your reservation logic here
  };

  return (
    <section id="rooms" className="py-8 text-primary">
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
            onReserve={(plan) => handleReserve(room, plan)}
          />
        ))}
      </div>

      <BookingModal
        onChangeState={setIsOpen}
        isOpen={isOpen}
        stay={stay}
        room={selectedRoom!}
        plan={selectedPlan!}
      />
    </section>
  );
}
