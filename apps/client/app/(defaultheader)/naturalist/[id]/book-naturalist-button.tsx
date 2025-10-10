"use client";

import { User } from "lucide-react";
import { useState } from "react";

import { NaturalistBookingModal } from "@/components/naturalist-booking-modal";
import { Button } from "@/components/ui/button";

interface Activity {
  id: number;
  name: string;
}

interface BookNaturalistButtonProps {
  naturalist: {
    id: number;
    name: string;
    park?: {
      id: number;
      name: string;
      slug: string;
    };
  };
  activities?: Activity[];
}

export function BookNaturalistButton({
  naturalist,
  activities = [],
}: BookNaturalistButtonProps) {
  const [showBookingModal, setShowBookingModal] = useState(false);

  console.log("activities", activities);

  return (
    <>
      <Button size="lg" onClick={() => setShowBookingModal(true)}>
        <User className="w-4 h-4 mr-2" />
        Book {naturalist.name}
      </Button>

      <NaturalistBookingModal
        isOpen={showBookingModal}
        onChangeState={setShowBookingModal}
        naturalist={naturalist}
        activities={activities}
      />
    </>
  );
}
