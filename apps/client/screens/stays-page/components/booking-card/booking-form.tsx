import { Calendar } from "lucide-react";

export const BookingForm = ({
  className = "",
  price,
}: {
  className?: string;
  price: number;
}) => (
  <div className={className}>
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-0 border border-border overflow-hidden">
        <div className="p-3 border-r border-border">
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Check-in
          </label>
          <input
            type="date"
            className="w-full mt-1 bg-transparent text-primary focus:outline-none text-sm"
            defaultValue="2025-08-29"
          />
        </div>
        <div className="p-3">
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Check-out
          </label>
          <input
            type="date"
            className="w-full mt-1 bg-transparent text-primary focus:outline-none text-sm"
            defaultValue="2025-08-31"
          />
        </div>
      </div>
      <div className="border border-border p-3">
        <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Guests
        </label>
        <select className="w-full mt-1 bg-transparent text-primary focus:outline-none text-sm">
          <option>1 guest</option>
          <option>2 guests</option>
          <option>3 guests</option>
          <option>4 guests</option>
          <option>5 guests</option>
          <option>6 guests</option>
          <option>7 guests</option>
          <option>8 guests</option>
        </select>
      </div>
      <button className="w-full bg-accent text-accent-foreground py-3 font-medium hover:bg-accent/90 transition-colors text-lg">
        Reserve
      </button>
      <p className="text-center text-sm text-muted-foreground">
        You won't be charged yet
      </p>
    </div>

    {/* Price Breakdown */}
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between text-primary">
        <span className="underline">₹{price.toLocaleString()} × 2 nights</span>
        <span>₹{(price * 2).toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between text-primary">
        <span className="underline">Cleaning fee</span>
        <span>₹2,500</span>
      </div>
      <div className="flex items-center justify-between text-primary">
        <span className="underline">Service fee</span>
        <span>₹3,200</span>
      </div>
      <div className="flex items-center justify-between text-primary">
        <span className="underline">Taxes</span>
        <span>₹1,840</span>
      </div>
      <div className="pt-4 border-t border-border flex items-center justify-between font-semibold text-primary text-lg">
        <span>Total</span>
        <span>₹{(price * 2 + 2500 + 3200 + 1840).toLocaleString()}</span>
      </div>
    </div>

    {/* Cancellation Policy */}
    {/* <div className="mt-6 pt-6 border-t border-border">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="w-4 h-4" />
        <span>{cancellationPolicy}</span>
      </div>
    </div> */}
  </div>
);
