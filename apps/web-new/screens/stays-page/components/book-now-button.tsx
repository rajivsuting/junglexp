"use client";
import { Button } from '@/components/ui/button';

const BookNowButton = () => {
  return (
    <div className="py-6">
      <Button
        type="button"
        onClick={() => {
          const el = document.getElementById("rooms");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        className="bg-[#2F2F2F] text-white hover:bg-[#444444] w-full"
      >
        Book now
      </Button>
    </div>
  );
};

export default BookNowButton;
