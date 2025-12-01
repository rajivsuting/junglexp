"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const BookingForm = ({
  className = "",
  price,
}: {
  className?: string;
  price: number;
}) => {
  const [checkIn, setCheckIn] = React.useState<Date | undefined>(
    new Date("2025-08-29")
  );
  const [checkOut, setCheckOut] = React.useState<Date | undefined>(
    new Date("2025-08-31")
  );

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-0 border border-border overflow-hidden">
          <div className="p-3 border-r border-border">
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Check-in
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left font-normal p-0 h-auto hover:bg-transparent hover:text-primary",
                    !checkIn && "text-muted-foreground"
                  )}
                >
                  {checkIn ? (
                    format(checkIn, "dd/MM/yyyy")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="p-3">
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Check-out
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left font-normal p-0 h-auto hover:bg-transparent hover:text-primary",
                    !checkOut && "text-muted-foreground"
                  )}
                >
                  {checkOut ? (
                    format(checkOut, "dd/MM/yyyy")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  initialFocus
                  disabled={(date) =>
                    checkIn ? date <= checkIn : date < new Date()
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="border border-border p-3">
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Guests
          </label>
          <select className="w-full mt-1 bg-transparent text-primary focus:outline-none text-sm cursor-pointer">
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
          <span className="underline">
            ₹{price.toLocaleString()} × 2 nights
          </span>
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
        <CalendarIcon className="w-4 h-4" />
        <span>{cancellationPolicy}</span>
      </div>
    </div> */}
    </div>
  );
};
