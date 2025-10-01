"use client";

import { format } from 'date-fns';
import { CalendarIcon, Star, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Package {
  id: number;
  name: string;
  price: number;
  max_participants?: number | null;
}

interface ActivityBookingCardMobileProps {
  packages: Package[];
  basePrice: number;
  rating?: number | null;
}

export function ActivityBookingCardMobile({
  packages,
  basePrice,
  rating,
}: ActivityBookingCardMobileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedPackage, setSelectedPackage] = useState<string>(
    packages?.[0]?.id?.toString() || ""
  );
  const [participants, setParticipants] = useState("1");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const selectedPkg = packages?.find(
    (pkg) => pkg.id.toString() === selectedPackage
  );
  const price = selectedPkg?.price || basePrice;
  const totalPrice = price * Number.parseInt(participants);
  const maxParticipants = selectedPkg?.max_participants || 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedDate ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.email
    ) {
      alert("Please fill in all required fields and select a date.");
      return;
    }

    alert("Booking request submitted! We'll contact you within 24 hours.");
    setIsOpen(false);
  };

  return (
    <>
      {/* Fixed Bottom Bar - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 z-50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">
                ₹{price.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">per person</span>
              {rating && (
                <div className="flex items-center gap-1 ml-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">{rating}</span>
                </div>
              )}
            </div>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="px-8">
                Book Now
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Book Your Activity</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {/* Package Selection */}
                {packages && packages.length > 1 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Select Package
                    </Label>
                    <Select
                      value={selectedPackage}
                      onValueChange={setSelectedPackage}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a package" />
                      </SelectTrigger>
                      <SelectContent>
                        {packages.map((pkg) => (
                          <SelectItem key={pkg.id} value={pkg.id.toString()}>
                            <div className="flex items-center justify-between w-full">
                              <span>{pkg.name}</span>
                              <span className="ml-2 font-semibold">
                                ₹{pkg.price}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Date Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate
                          ? format(selectedDate, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Participants */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Participants</Label>
                  <Select value={participants} onValueChange={setParticipants}>
                    <SelectTrigger>
                      <SelectValue placeholder="Number of people" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(maxParticipants)].map((_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {i + 1} {i + 1 === 1 ? "Person" : "People"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">First Name*</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Last Name*</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Email*</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Phone</Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Special Requests
                  </Label>
                  <Textarea
                    value={formData.specialRequests}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialRequests: e.target.value,
                      })
                    }
                    placeholder="Any special requirements..."
                    rows={3}
                  />
                </div>

                {/* Price Summary */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      ₹{price.toLocaleString()} x {participants} people
                    </span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Confirm Booking
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Free cancellation up to 24 hours before the activity
                </p>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Spacer for fixed bottom bar */}
      <div className="lg:hidden h-24" />
    </>
  );
}
