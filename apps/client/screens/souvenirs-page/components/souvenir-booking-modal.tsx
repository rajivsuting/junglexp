"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSouvenirBooking } from "@repo/actions/souvenir-bookings.actions";

import type { TNewSouvenirBooking } from "@repo/db/schema/souvenir-bookings";
import type { TSouvenir } from "@repo/db/index";

// Zod schema for form validation
const souvenirBookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  quantity: z.number().min(1, "At least 1 quantity is required"),
  message: z.string().optional(),
});

type SouvenirBookingFormData = z.infer<typeof souvenirBookingSchema>;

interface SouvenirBookingModalProps {
  souvenir: TSouvenir;
  isOpen: boolean;
  onChangeState: (state: boolean) => void;
}

export function SouvenirBookingModal({
  souvenir,
  isOpen,
  onChangeState,
}: SouvenirBookingModalProps) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SouvenirBookingFormData>({
    resolver: zodResolver(souvenirBookingSchema),
    defaultValues: {
      quantity: 1,
      message: "",
    },
  });

  const watchedValues = watch();

  const handleFormSubmit = async (data: SouvenirBookingFormData) => {
    try {
      setIsLoading(true);
      const details: TNewSouvenirBooking = {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        souvenir_id: souvenir.id,
        rate: souvenir.price,
        quantity: data.quantity,
        message: data.message,
      };
      const newBooking = await createSouvenirBooking(details);

      if (newBooking) {
        onChangeState(false);
        setBookingDetails(newBooking);
        setShowSuccessModal(true);
        reset();
      }
    } catch (error) {
      console.error("Booking submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    return souvenir.price * (watchedValues.quantity || 1);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onChangeState}>
        <DialogContent className="sm:max-w-3xl max-h-[100dvh] md:max-h-[90dvh] flex flex-col p-0 z-50">
          <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
            <DialogTitle>Send Enquiry</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-6 pt-4"
            >
              {/* Souvenir Details Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Souvenir Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{souvenir.name}</h3>
                      {souvenir.park && (
                        <p className="text-sm text-muted-foreground">
                          {souvenir.park.name}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-semibold text-lg">
                          ₹{souvenir.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <Badge
                        className={
                          souvenir.quantity > 0
                            ? "bg-green-600 hover:bg-green-600/90"
                            : "bg-gray-500"
                        }
                      >
                        {souvenir.quantity > 0 ? "In stock" : "Out of stock"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Details Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Select
                      value={watchedValues.quantity?.toString()}
                      onValueChange={(value) =>
                        setValue("quantity", parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select quantity" />
                      </SelectTrigger>
                      <SelectContent className="z-[60]">
                        {Array.from(
                          { length: Math.min(souvenir.quantity, 20) },
                          (_, i) => i + 1
                        ).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "Item" : "Items"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.quantity && (
                      <p className="text-sm text-red-500">
                        {errors.quantity.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Details Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        {...register("mobile")}
                        placeholder="Enter mobile number"
                      />
                      {errors.mobile && (
                        <p className="text-sm text-red-500">
                          {errors.mobile.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
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

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Textarea
                        id="message"
                        {...register("message")}
                        placeholder="Any special requests or questions?"
                        rows={3}
                      />
                      {errors.message && (
                        <p className="text-sm text-red-500">
                          {errors.message.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Price per item</span>
                      <span>₹{souvenir.price.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity</span>
                      <span>{watchedValues.quantity || 1}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Amount</span>
                      <span>₹{calculateTotal().toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                  {isLoading ? "Sending..." : "Send Enquiry"}
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
                Enquiry Sent Successfully!
              </DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Your enquiry has been successfully submitted. We will contact
                you shortly to confirm the details.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Souvenir:</span>
                  <span>{bookingDetails.souvenir.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Quantity:</span>
                  <span>{bookingDetails.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{bookingDetails.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span>{bookingDetails.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Mobile:</span>
                  <span>{bookingDetails.mobile}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total Amount:</span>
                  <span className="text-green-600">
                    ₹
                    {(
                      bookingDetails.rate * bookingDetails.quantity
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
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
