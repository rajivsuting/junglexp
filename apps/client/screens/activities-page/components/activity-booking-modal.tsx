"use client";

import { format } from "date-fns";
import { CalendarIcon, CheckCircle2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { createActivityBooking } from "@repo/actions";
import { getActivityDates } from "@repo/actions/activities.actions";

import type { TActivityBookingBase } from "@repo/db/schema/activity-bookings";
import { toast } from "sonner";
import type { TActivityPackageBase } from "@repo/db/index";

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10, "Phone number must be at least 10 digits"),
  preferredDate: z.date().refine((date) => date !== undefined, {
    message: "Please select a date",
  }),
  numberOfAdults: z.number().min(1, "At least 1 adult required"),
  numberOfKids: z.number().min(0, "Cannot be negative"),
  message: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface Activity {
  id: number;
  name: string;
  slug?: string;
}

interface ActivityBookingModalProps {
  isOpen: boolean;
  onChangeState: (state: boolean) => void;
  selectedPackage: TActivityPackageBase;
  activity: Activity;
}

export function ActivityBookingModal({
  isOpen,
  onChangeState,
  selectedPackage,
  activity,
}: ActivityBookingModalProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingDetails, setBookingDetails] =
    useState<TActivityBookingBase | null>(null);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [loadingDates, setLoadingDates] = useState(false);

  useEffect(() => {
    const fetchDates = async () => {
      if (!activity.id) return;
      try {
        setLoadingDates(true);
        const dates = await getActivityDates(activity.id);
        setAvailableDates(dates.map((d) => new Date(d)));
      } catch (error) {
        console.error("Failed to fetch available dates", error);
      } finally {
        setLoadingDates(false);
      }
    };
    if (isOpen) {
      fetchDates();
    }
  }, [activity.id, isOpen]);

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
      numberOfKids: 0,
    },
  });

  const watchedValues = watch();
  const maxParticipants = selectedPackage.number || 0;

  const handleFormSubmit = async (data: BookingFormData) => {
    try {
      setIsLoading(true);
      const newBooking = await createActivityBooking({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        preferredDate: data.preferredDate.toISOString().split("T")[0],
        numberOfAdults: data.numberOfAdults,
        numberOfKids: data.numberOfKids,
        message: data.message || "",
        activity_id: activity.id,
      });

      if (newBooking) {
        onChangeState(false);
        setBookingDetails(newBooking as TActivityBookingBase);
        setShowSuccessModal(true);
        reset();
      }
    } catch (error) {
      console.error("Booking submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalParticipants =
    (watchedValues.numberOfAdults || 0) + (watchedValues.numberOfKids || 0);
  const totalPrice = selectedPackage.price * totalParticipants;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onChangeState}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book Your Activity</DialogTitle>
            <DialogDescription>
              Complete the form below to book {selectedPackage.name}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              {/* Package Info */}
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    {selectedPackage.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Price per person</span>
                    <span className="font-semibold">
                      ₹{selectedPackage.price.toLocaleString()}
                    </span>
                  </div>
                  {selectedPackage.duration && (
                    <div className="flex justify-between text-sm">
                      <span>Duration</span>
                      <span>{selectedPackage.duration} Hours</span>
                    </div>
                  )}
                  {selectedPackage.number && (
                    <div className="flex justify-between text-sm">
                      <span>Max Participants</span>
                      <span>{selectedPackage.number} people</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold">Contact Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name*</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email*</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">Phone Number*</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      {...register("mobile")}
                      placeholder="+91 1234567890"
                    />
                    {errors.mobile && (
                      <p className="text-sm text-destructive">
                        {errors.mobile.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-4">
                <h3 className="font-semibold">Booking Details</h3>

                <div className="space-y-2">
                  <Label>Select Date*</Label>
                  {loadingDates ? (
                    <div className="flex items-center gap-2 h-10 px-3 border rounded-md text-muted-foreground text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading dates...
                    </div>
                  ) : availableDates.length > 0 ? (
                    <Select
                      value={
                        watchedValues.preferredDate
                          ? format(watchedValues.preferredDate, "yyyy-MM-dd")
                          : ""
                      }
                      onValueChange={(value) => {
                        const date = new Date(value + "T00:00:00");
                        setValue("preferredDate", date);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a date" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDates
                          .sort((a, b) => a.getTime() - b.getTime())
                          .filter((date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date >= today;
                          })
                          .map((date) => (
                            <SelectItem
                              key={date.toISOString()}
                              value={format(date, "yyyy-MM-dd")}
                            >
                              {format(date, "PPP")}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No dates available
                    </p>
                  )}
                  {errors.preferredDate && (
                    <p className="text-sm text-destructive">
                      {errors.preferredDate.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numberOfAdults">Number of Adults*</Label>
                    <Select
                      value={watchedValues.numberOfAdults?.toString()}
                      onValueChange={(value) => {
                        const newAdults = parseInt(value);
                        const currentKids = watchedValues.numberOfKids || 0;
                        if (
                          maxParticipants > 0 &&
                          newAdults + currentKids > maxParticipants
                        ) {
                          toast.error(
                            `Total participants cannot exceed ${maxParticipants}`
                          );
                          return;
                        }
                        setValue("numberOfAdults", newAdults);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(maxParticipants || 10)].map((_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            {i + 1} {i + 1 === 1 ? "Adult" : "Adults"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.numberOfAdults && (
                      <p className="text-sm text-destructive">
                        {errors.numberOfAdults.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numberOfKids">Number of Children</Label>
                    <Select
                      value={watchedValues.numberOfKids?.toString()}
                      onValueChange={(value) => {
                        const newKids = parseInt(value);
                        const currentAdults = watchedValues.numberOfAdults || 0;
                        if (
                          maxParticipants > 0 &&
                          currentAdults + newKids > maxParticipants
                        ) {
                          toast.error(
                            `Total participants cannot exceed ${maxParticipants}`
                          );
                          return;
                        }
                        setValue("numberOfKids", newKids);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(maxParticipants || 10)].map((_, i) => (
                          <SelectItem key={i} value={String(i)}>
                            {i} {i === 1 ? "Child" : "Children"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.numberOfKids && (
                      <p className="text-sm text-destructive">
                        {errors.numberOfKids.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Special Requests (Optional)</Label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    placeholder="Any special requirements or requests..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Booking Summary */}
              {watchedValues.preferredDate && totalParticipants > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Package</span>
                        <span>{selectedPackage.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price per person</span>
                        <span>₹{selectedPackage.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Participants</span>
                        <span>
                          {totalParticipants}{" "}
                          {totalParticipants === 1 ? "person" : "people"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          ({watchedValues.numberOfAdults || 0} Adults,{" "}
                          {watchedValues.numberOfKids || 0} Children)
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total Amount</span>
                        <span>₹{totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onChangeState(false)}
                  disabled={isSubmitting || isLoading}
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

              <p className="text-xs text-muted-foreground text-center">
                Free cancellation up to 24 hours before the activity
              </p>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center">
              Booking Confirmed!
            </DialogTitle>
            <DialogDescription className="text-center">
              Your activity booking has been received successfully.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking ID</span>
                  <span className="font-mono">{bookingDetails?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Activity</span>
                  <span>{activity.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Package</span>
                  <span>{selectedPackage.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="capitalize text-yellow-600">
                    {bookingDetails?.status || "Pending"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-center">
                We've sent a confirmation email to{" "}
                <span className="font-semibold">{bookingDetails?.email}</span>
              </p>
              <p className="text-sm text-center text-muted-foreground mt-2">
                Our team will contact you within 24 hours to confirm your
                booking.
              </p>
            </div>

            <Button
              onClick={() => setShowSuccessModal(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
