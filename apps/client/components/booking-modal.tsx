"use client";

import { format } from "date-fns";
import { CalendarIcon, MapPin, Star, Users } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ceateHotelBooking } from "@repo/actions/hotel-bookings.action";

import type { THotelBase } from "@repo/db/schema/hotels";
import type { THotel, THotelBooking, TRoom, TRoomPlan } from "@repo/db/index";
import type {
  THotelBookingBase,
  TNewHotelBooking,
} from "@repo/db/schema/hotel-bookings";
// Zod schema for form validation
const bookingSchema = z
  .object({
    // Check-in/Check-out dates
    checkInDate: z.date({
      // required_error: "Check-in date is required",
    }),
    checkOutDate: z.date({
      // required_error: 'Check-out date is required',
    }),
    // User details
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    // Booking details
    numberOfAdults: z.number().min(1, "At least 1 adult is required"),
    numberOfChildren: z
      .number()
      .min(0, "Number of children cannot be negative"),
    numberOfRooms: z.number().min(1, "At least 1 room is required"),
  })
  .refine((data) => data.checkOutDate > data.checkInDate, {
    message: "Check-out date must be after check-in date",
    path: ["checkOutDate"],
  });

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  room: TRoom;
  stay: THotel;
  trigger?: React.ReactNode;
  isOpen: boolean;
  plan: TRoomPlan;
  onChangeState: (state: boolean) => void;
}

export function BookingModal({
  room,
  trigger,
  isOpen,
  plan,
  stay,
  onChangeState,
}: BookingModalProps) {
  const [checkInCalendarOpen, setCheckInCalendarOpen] = useState(false);
  const [checkOutCalendarOpen, setCheckOutCalendarOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<THotelBooking | null>(
    null
  );
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      numberOfAdults: 1,
      numberOfChildren: 0,
      numberOfRooms: 1,
    },
  });

  const watchedValues = watch();

  const handleFormSubmit = async (data: BookingFormData) => {
    try {
      setIsLoading(true);
      const details: TNewHotelBooking = {
        email: data.email,
        name: data.firstName + " " + data.lastName,
        mobile_no: data.phone,
        check_in_date: data.checkInDate.toISOString(),
        check_out_date: data.checkOutDate.toISOString(),
        no_of_rooms_required: data.numberOfRooms,
        no_of_adults: data.numberOfAdults,
        no_of_kids: data.numberOfChildren,
        room_id: room.id,
        hotel_id: stay.id,
        plan_id: plan.id,
      };
      const newBooking = await ceateHotelBooking(details);

      if (newBooking) {
        onChangeState(false);
        setBookingDetails(newBooking as any);
        setShowSuccessModal(true);
        reset();
      }
    } catch (error) {
      console.error("Booking submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNights = (checkInDate?: Date, checkOutDate?: Date) => {
    const inDate = checkInDate || watchedValues.checkInDate;
    const outDate = checkOutDate || watchedValues.checkOutDate;

    if (inDate && outDate) {
      const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights(
      watchedValues.checkInDate,
      watchedValues.checkOutDate
    );
    return nights * plan?.price * watchedValues.numberOfRooms;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onChangeState}>
        <DialogContent className="sm:max-w-4xl max-h-[100dvh] md:max-h-[90dvh] flex flex-col p-0 z-50">
          <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
            <DialogTitle>Complete Your Booking</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-6 pt-4"
            >
              {/* Hotel Details Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Hotel Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{stay.name}</h3>

                      {stay.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{stay.rating}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{room?.name}</h4>
                      <Badge variant="secondary" className="mb-2">
                        {plan?.plan_type}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Max occupancy: {room?.capacity} guests
                      </p>
                      <p className="font-semibold text-lg">
                        ₹{plan?.price}/night
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Check-in/Check-out Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Booking Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkInDate">Check-in Date</Label>
                      <Popover
                        open={checkInCalendarOpen}
                        onOpenChange={setCheckInCalendarOpen}
                        modal={true}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !watchedValues.checkInDate &&
                                "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {watchedValues.checkInDate ? (
                              format(watchedValues.checkInDate, "PPP")
                            ) : (
                              <span>Pick check-in date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 z-[60]"
                          align="start"
                          side="bottom"
                          sideOffset={4}
                        >
                          <Calendar
                            mode="single"
                            selected={watchedValues.checkInDate}
                            onSelect={(date) => {
                              setValue("checkInDate", date as Date);
                              setCheckInCalendarOpen(false);
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.checkInDate && (
                        <p className="text-sm text-red-500">
                          {errors.checkInDate.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="checkOutDate">Check-out Date</Label>
                      <Popover
                        open={checkOutCalendarOpen}
                        onOpenChange={setCheckOutCalendarOpen}
                        modal={true}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !watchedValues.checkOutDate &&
                                "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {watchedValues.checkOutDate ? (
                              format(watchedValues.checkOutDate, "PPP")
                            ) : (
                              <span>Pick check-out date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 z-[60]"
                          align="start"
                          side="bottom"
                          sideOffset={4}
                        >
                          <Calendar
                            mode="single"
                            selected={watchedValues.checkOutDate}
                            onSelect={(date) => {
                              setValue("checkOutDate", date as Date);
                              setCheckOutCalendarOpen(false);
                            }}
                            disabled={(date) =>
                              date < new Date() ||
                              (watchedValues.checkInDate &&
                                date <= watchedValues.checkInDate)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.checkOutDate && (
                        <p className="text-sm text-red-500">
                          {errors.checkOutDate.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numberOfRooms">Number of Rooms</Label>
                      <Select
                        value={watchedValues.numberOfRooms?.toString()}
                        onValueChange={(value) =>
                          setValue("numberOfRooms", parseInt(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select rooms" />
                        </SelectTrigger>
                        <SelectContent className="z-[60]">
                          {Array.from({ length: 10 }, (_, i) => i + 1).map(
                            (num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? "Room" : "Rooms"}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      {errors.numberOfRooms && (
                        <p className="text-sm text-red-500">
                          {errors.numberOfRooms.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="numberOfAdults">Number of Adults</Label>
                      <Select
                        value={watchedValues.numberOfAdults?.toString()}
                        onValueChange={(value) =>
                          setValue("numberOfAdults", parseInt(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select adults" />
                        </SelectTrigger>
                        <SelectContent className="z-[60]">
                          {Array.from({ length: 30 }, (_, i) => i + 1).map(
                            (num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? "Adult" : "Adults"}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      {errors.numberOfAdults && (
                        <p className="text-sm text-red-500">
                          {errors.numberOfAdults.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numberOfChildren">
                        Children (5-12 yrs)
                      </Label>
                      <Select
                        value={watchedValues.numberOfChildren?.toString()}
                        onValueChange={(value) =>
                          setValue("numberOfChildren", parseInt(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select children" />
                        </SelectTrigger>
                        <SelectContent className="z-[60]">
                          {Array.from({ length: 30 }, (_, i) => i).map(
                            (num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? "Child" : "Children"}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      {errors.numberOfChildren && (
                        <p className="text-sm text-red-500">
                          {errors.numberOfChildren.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Details Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Guest Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...register("firstName")}
                        placeholder="Enter first name"
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...register("lastName")}
                        placeholder="Enter last name"
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="Enter email address"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register("phone")}
                        placeholder="Enter phone number"
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Summary */}
              {watchedValues.checkInDate && watchedValues.checkOutDate && (
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Room Rate (per night)</span>
                        <span>₹{plan.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Number of Nights</span>
                        <span>
                          {calculateNights(
                            watchedValues.checkInDate,
                            watchedValues.checkOutDate
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Number of Rooms</span>
                        <span>{watchedValues.numberOfRooms}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total Amount</span>
                        <span>₹{calculateTotal()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  disabled={isSubmitting || isLoading}
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onChangeState(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting || isLoading}
                >
                  {isLoading ? "Processing..." : "Confirm Booking"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        {bookingDetails && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <DialogTitle className="text-xl text-center font-semibold text-green-600">
                Booking Confirmed!
              </DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Your booking request has been successfully submitted. We will
                contact you shortly to confirm the details.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Hotel:</span>
                  <span>{bookingDetails.hotel.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Room:</span>
                  <span>{bookingDetails.room?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Plan:</span>
                  <span>{bookingDetails.plan.plan_type}</span>
                </div>
                {/* {bookingDetails.check_in_date &&
                  bookingDetails.check_out_date && (
                    <>
                      <div className="flex justify-between">
                        <span className="font-medium">Check-in:</span>
                        <span>
                          {(() => {
                            try {
                              return format(
                                new Date(bookingDetails.check_in_date),
                                "PPP"
                              );
                            } catch {
                              return bookingDetails.check_in_date;
                            }
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Check-out:</span>
                        <span>
                          {(() => {
                            try {
                              return format(
                                new Date(bookingDetails.check_out_date),
                                "PPP"
                              );
                            } catch {
                              return bookingDetails.check_out_date;
                            }
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Total Nights:</span>
                        <span>
                          {(() => {
                            try {
                              return calculateNights(
                                new Date(bookingDetails.check_in_date),
                                new Date(bookingDetails.check_out_date)
                              );
                            } catch {
                              return "N/A";
                            }
                          })()}
                        </span>
                      </div>
                    </>
                  )} */}
                <div className="flex justify-between">
                  <span className="font-medium">Guests:</span>
                  <span>
                    {bookingDetails.no_of_adults} Adults
                    {bookingDetails.no_of_kids > 0 &&
                      `, ${bookingDetails.no_of_kids} Children`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Rooms:</span>
                  <span>{bookingDetails.no_of_rooms_required}</span>
                </div>
                {/* {bookingDetails.check_in_date &&
                  bookingDetails.check_out_date && (
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                      <span>Total Amount:</span>
                      <span className="text-green-600">
                        ₹{calculateTotal()}
                      </span>
                    </div>
                  )} */}
              </div>

              <p className="text-xs text-muted-foreground">
                An executive will contact you shortly to confirm the details.
              </p>

              <Button
                onClick={() => setShowSuccessModal(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
