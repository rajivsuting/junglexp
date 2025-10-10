"use client";

import { format } from "date-fns";
import { CalendarIcon, CheckCircle2, User } from "lucide-react";
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNaturalistBooking } from "@repo/actions/naturalist-bookings.actions";

import type { TNaturalistBookingBase } from "@repo/db/schema/naturalist-bookings";

const bookingSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    mobile: z.string().min(10, "Phone number must be at least 10 digits"),
    dateOfSafari: z.date().optional(),
    slot: z.string().min(1, "Please select a slot"),
    activityId: z.string().optional(),
    specialisedInterest: z
      .string()
      .min(10, "Please describe your interests (minimum 10 characters)"),
  })
  .refine((data) => data.dateOfSafari !== undefined, {
    message: "Please select a date",
    path: ["dateOfSafari"],
  });

type BookingFormData = z.infer<typeof bookingSchema>;

interface Activity {
  id: number;
  name: string;
}

interface Naturalist {
  id: number;
  name: string;
  park?: {
    id: number;
    name: string;
    slug: string;
  };
}

interface NaturalistBookingModalProps {
  isOpen: boolean;
  onChangeState: (state: boolean) => void;
  naturalist: Naturalist;
  activities?: Activity[];
}

export function NaturalistBookingModal({
  isOpen,
  onChangeState,
  naturalist,
  activities = [],
}: NaturalistBookingModalProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingDetails, setBookingDetails] =
    useState<TNaturalistBookingBase | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const watchedValues = watch();

  const handleFormSubmit = async (data: BookingFormData) => {
    try {
      setIsLoading(true);
      if (!data.dateOfSafari) {
        return;
      }

      const newBooking = await createNaturalistBooking({
        name: data.name,
        email: data.email,
        mobile_no: data.mobile,
        date_of_safari: data.dateOfSafari.toISOString().split("T")[0]!,
        slot: data.slot,
        activity_id: data.activityId ? parseInt(data.activityId) : undefined,
        specialised_interest: data.specialisedInterest,
        park_id: naturalist.park?.id,
      });

      if (newBooking) {
        onChangeState(false);
        setBookingDetails(newBooking[0] as TNaturalistBookingBase);
        setShowSuccessModal(true);
        reset();
      }
    } catch (error) {
      console.error("Booking submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const slots = [
    { value: "morning", label: "Morning (6:00 AM - 9:00 AM)" },
    { value: "afternoon", label: "Afternoon (2:00 PM - 5:00 PM)" },
    { value: "full_day", label: "Full Day (6:00 AM - 5:00 PM)" },
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onChangeState}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book a Naturalist</DialogTitle>
            <DialogDescription>
              Complete the form below to book {naturalist.name}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              {/* Naturalist Info */}
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {naturalist.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {naturalist.park && (
                    <div className="flex justify-between text-sm">
                      <span>National Park</span>
                      <span className="font-semibold">
                        {naturalist.park.name}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Our expert naturalist will guide you through the wilderness
                    and help you discover the rich biodiversity of the region.
                  </p>
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

              {/* Safari Details */}
              <div className="space-y-4">
                <h3 className="font-semibold">Safari Details</h3>

                <div className="space-y-2">
                  <Label>Date of Safari*</Label>
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !watchedValues.dateOfSafari && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {watchedValues.dateOfSafari
                          ? format(watchedValues.dateOfSafari, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={watchedValues.dateOfSafari}
                        onSelect={(date) => {
                          setValue("dateOfSafari", date as Date);
                          setIsCalendarOpen(false);
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.dateOfSafari && (
                    <p className="text-sm text-destructive">
                      {errors.dateOfSafari.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slot">Preferred Time Slot*</Label>
                  <Select
                    value={watchedValues.slot}
                    onValueChange={(value) => setValue("slot", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {slots.map((slot) => (
                        <SelectItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.slot && (
                    <p className="text-sm text-destructive">
                      {errors.slot.message}
                    </p>
                  )}
                </div>

                {activities.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="activityId">
                      Specific Activity (Optional)
                    </Label>
                    <Select
                      value={watchedValues.activityId}
                      onValueChange={(value) => setValue("activityId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an activity (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* <SelectItem value="">No specific activity</SelectItem> */}
                        {activities.map((activity) => (
                          <SelectItem
                            key={activity.id}
                            value={activity.id.toString()}
                          >
                            {activity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Select a specific activity if you have one in mind, or
                      leave blank for general guidance.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="specialisedInterest">
                    Specialized Interests*
                  </Label>
                  <Textarea
                    id="specialisedInterest"
                    {...register("specialisedInterest")}
                    placeholder="Tell us about your interests (e.g., bird watching, wildlife photography, specific species you'd like to spot, etc.)"
                    rows={4}
                  />
                  {errors.specialisedInterest && (
                    <p className="text-sm text-destructive">
                      {errors.specialisedInterest.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    This helps our naturalist prepare and customize your
                    experience.
                  </p>
                </div>
              </div>

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
                Your booking will be confirmed within 24 hours
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
              Booking Request Received!
            </DialogTitle>
            <DialogDescription className="text-center">
              Your naturalist booking request has been submitted successfully.
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
                  <span className="text-muted-foreground">Naturalist</span>
                  <span>{naturalist.name}</span>
                </div>
                {naturalist.park && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Park</span>
                    <span>{naturalist.park.name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span>
                    {bookingDetails?.date_of_safari
                      ? format(new Date(bookingDetails.date_of_safari), "PPP")
                      : "N/A"}
                  </span>
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
                Our team will review your request and contact you within 24
                hours to confirm availability and finalize details.
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
