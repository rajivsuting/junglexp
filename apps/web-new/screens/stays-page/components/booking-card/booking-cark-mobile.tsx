"use client";
import { Star, X } from "lucide-react";
import { useState } from "react";

import { BookingForm } from "./booking-form";

export const BookingCardMobile = ({
  price,
  originalPrice,
  rating,
}: {
  price: number;
  originalPrice: number;
  rating: number;
}) => {
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 z-40">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold text-primary">
                ₹{price.toLocaleString()}
              </span>
              {originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-sm text-muted-foreground">/night</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-accent fill-current" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          </div>
          <button
            onClick={() => setShowBookingModal(true)}
            className="bg-accent text-accent-foreground px-6 py-3 font-medium hover:bg-accent/90 transition-colors rounded-lg"
          >
            Reserve Now
          </button>
        </div>
      </div>

      {showBookingModal && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-t-xl">
            <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary">Reserve</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-primary">
                    ₹{price.toLocaleString()}
                  </span>
                  {originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-muted-foreground">/night</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-accent fill-current" />
                  <span className="font-medium">{rating}</span>
                  {/* <span className="text-muted-foreground">({reviews})</span> */}
                </div>
              </div>
              <BookingForm price={price} className="pb-6" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
