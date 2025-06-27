"use client";

import { format } from 'date-fns';
import { CalendarIcon, MapPin, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const roomTypes = [
  { id: "standard", name: "Standard Room", price: 299, capacity: 2 },
  { id: "deluxe", name: "Deluxe Suite", price: 449, capacity: 4 },
  { id: "oceanview", name: "Ocean View Suite", price: 599, capacity: 4 },
  { id: "presidential", name: "Presidential Suite", price: 999, capacity: 6 },
];

export function BookingSection() {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState<string>("2");
  const [roomType, setRoomType] = useState<string>("");
  const [specialRequests, setSpecialRequests] = useState("");

  const handleBooking = () => {
    if (!checkIn || !checkOut || !roomType) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    toast.success("Booking Request Submitted!", {
      description: "We'll contact you shortly to confirm your reservation.",
    });
  };

  const selectedRoom = roomTypes.find((room) => room.id === roomType);
  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;
  const totalPrice =
    selectedRoom && nights > 0 ? selectedRoom.price * nights : 0;

  return (
    <section
      id="booking-section"
      className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Book Your Perfect Stay
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your dates, select your perfect room, and let us create an
            unforgettable experience for you.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-amber-600" />
              Reserve Your Escape
            </CardTitle>
            <CardDescription>
              All fields marked with * are required
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkin">Check-in Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkIn && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn
                        ? format(checkIn, "PPP")
                        : "Select check-in date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkout">Check-out Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkOut && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOut
                        ? format(checkOut, "PPP")
                        : "Select check-out date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      disabled={(date) => date <= (checkIn || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Guests and Room Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guests">Number of Guests</Label>
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger>
                    <Users className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select guests" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} Guest{num > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomtype">Room Type *</Label>
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{room.name}</span>
                          <Badge variant="secondary" className="ml-2">
                            ${room.price}/night
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Room Details */}
            {selectedRoom && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="font-semibold text-amber-800 mb-2">
                  {selectedRoom.name}
                </h4>
                <div className="flex flex-wrap gap-2 text-sm text-amber-700">
                  <Badge variant="outline">
                    Up to {selectedRoom.capacity} guests
                  </Badge>
                  <Badge variant="outline">
                    ${selectedRoom.price} per night
                  </Badge>
                  {nights > 0 && (
                    <Badge variant="outline">
                      {nights} night{nights > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
                {totalPrice > 0 && (
                  <div className="mt-2 text-lg font-semibold text-amber-800">
                    Total: ${totalPrice.toLocaleString()}
                  </div>
                )}
              </div>
            )}

            {/* Special Requests */}
            <div className="space-y-2">
              <Label htmlFor="requests">Special Requests</Label>
              <Textarea
                id="requests"
                placeholder="Any special accommodations, dietary requirements, or preferences..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleBooking}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg"
              size="lg"
            >
              Book Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
