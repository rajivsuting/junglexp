"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { SouvenirBookingModal } from "./souvenir-booking-modal";

import type { TSouvenir } from "@repo/db/index";

interface SouvenirBookingButtonProps {
  souvenir: TSouvenir;
}

export function SouvenirBookingButton({
  souvenir,
}: SouvenirBookingButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        size="lg"
        className="bg-primary text-primary-foreground hover:opacity-90"
        disabled={souvenir.quantity === 0}
        onClick={() => setIsModalOpen(true)}
      >
        Send Enquiry
      </Button>
      <SouvenirBookingModal
        souvenir={souvenir}
        isOpen={isModalOpen}
        onChangeState={setIsModalOpen}
      />
    </>
  );
}
