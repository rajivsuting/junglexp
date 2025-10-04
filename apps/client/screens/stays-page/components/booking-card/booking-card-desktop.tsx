import { Star } from "lucide-react";

import { BookingForm } from "./booking-form";

export const BookingCardDesktop = ({
  price,
  originalPrice,
  rating,
}: {
  price: number;
  originalPrice: number;
  rating: number;
}) => {
  return (
    <div className="lg:col-span-1 hidden lg:block">
      <div className="sticky top-24 border border-border p-6 shadow-lg bg-card">
        <div className="flex items-center justify-between mb-4">
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

        <BookingForm price={price} />
      </div>
    </div>
  );
};
