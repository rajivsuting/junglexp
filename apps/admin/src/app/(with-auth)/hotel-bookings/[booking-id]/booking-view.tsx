"use client";

import {
  ArrowLeft,
  Bed,
  Calendar,
  Check,
  Clock,
  Hotel,
  Mail,
  MapPin,
  Phone,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { updateHotelBookingStatus } from "@repo/actions/hotel-bookings.action";

import type { THotelBooking } from "@repo/db/index";

interface HotelBookingViewProps {
  booking: THotelBooking;
}

const mealPlanOptions = [
  { value: "EP", label: "European Plan (Room only)" },
  { value: "CP", label: "Continental Plan (Room + Breakfast)" },
  {
    value: "MAP",
    label: "Modified American Plan (Room + Breakfast + Dinner)",
  },
  { value: "AP", label: "American Plan (All meals included)" },
] as const;
const HotelBookingView: React.FC<HotelBookingViewProps> = ({ booking }) => {
  const [status, setStatus] = useState(booking.status);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStatusUpdate = async (
    newStatus: "pending" | "confirmed" | "cancelled"
  ) => {
    setLoading(true);
    try {
      await updateHotelBookingStatus(booking.id, newStatus);
      setStatus(newStatus);
      toast.success(`Booking status updated to ${newStatus}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update booking status");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: {
        variant: "secondary" as const,
        className: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      },
      confirmed: {
        variant: "default" as const,
        className: "bg-green-100 text-green-800",
        icon: Check,
      },
      cancelled: {
        variant: "destructive" as const,
        className: "bg-red-100 text-red-800",
        icon: X,
      },
    };

    const config =
      variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={config.className}>
        <Icon className="mr-1 h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const planText = mealPlanOptions.find(
    (plan) => plan.value === booking.plan?.plan_type
  )?.label;
  const calculateNights = () => {
    const checkIn = new Date(booking.check_in_date);
    const checkOut = new Date(booking.check_out_date);
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-4">
          <Link href="/hotel-bookings">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Bookings
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Booking #{booking.id}</h1>
            <p className="text-muted-foreground">Booking for {booking.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(status)}
          <Select
            value={status}
            onValueChange={handleStatusUpdate}
            disabled={loading}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Update Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Name
              </label>
              <p className="text-lg font-semibold">{booking.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${booking.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {booking.email}
                </a>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Mobile Number
              </label>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`tel:+${booking.mobile_no}`}
                  className="text-blue-600 hover:underline"
                >
                  +{booking.mobile_no}
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Accommodation Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hotel className="h-5 w-5" />
              Accommodation Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Hotel
              </label>
              <p className="text-lg font-semibold">
                {booking.hotel?.name || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Room
              </label>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {booking.room?.name || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Rooms Required
              </label>
              <p className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-muted-foreground" />
                {booking.no_of_rooms_required} room
                {booking.no_of_rooms_required > 1 ? "s" : ""}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Plan
              </label>
              <p className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-muted-foreground" />
                {planText || "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stay Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Stay Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Check-in Date
              </label>
              <p className="text-lg">{formatDate(booking.check_in_date)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Check-out Date
              </label>
              <p className="text-lg">{formatDate(booking.check_out_date)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Duration
              </label>
              <p className="text-lg font-semibold">
                {calculateNights()} night{calculateNights() > 1 ? "s" : ""}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Guest Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Guest Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Adults
                </label>
                <p className="text-2xl font-bold text-blue-600">
                  {booking.no_of_adults}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Children
                </label>
                <p className="text-2xl font-bold text-green-600">
                  {booking.no_of_kids}
                </p>
              </div>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Total Guests
              </label>
              <p className="text-2xl font-bold">
                {booking.no_of_adults + booking.no_of_kids}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HotelBookingView;
