"use client";

import {
    ArrowLeft, Check, Clock, Mail, MessageSquare, Phone, ShoppingBag, Users, X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { updateSouvenirBookingStatus } from '@repo/actions/souvenir-bookings.actions';

import type { TSouvenirBookingBase } from "@repo/db/schema/souvenir-bookings";

type SouvenirBooking = TSouvenirBookingBase & {
  souvenir: {
    id: number;
    name: string;
    description: string | null;
    price: number;
  } | null;
};

interface SouvenirBookingViewProps {
  booking: SouvenirBooking;
}

const SouvenirBookingView: React.FC<SouvenirBookingViewProps> = ({
  booking,
}) => {
  const [status, setStatus] = useState(booking.status);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStatusUpdate = async (
    newStatus: "pending" | "confirmed" | "cancelled"
  ) => {
    setLoading(true);
    try {
      await updateSouvenirBookingStatus(booking.id, newStatus);
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

  const totalAmount = booking.quantity * booking.rate;

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-4">
          <Link href="/souvenir-bookings">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Bookings
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              Booking #{booking.id.slice(0, 8)}
            </h1>
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
                  href={`tel:${booking.mobile}`}
                  className="text-blue-600 hover:underline"
                >
                  {booking.mobile}
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Souvenir Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Souvenir Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Souvenir
              </label>
              <p className="text-lg font-semibold">
                {booking.souvenir?.name || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Quantity
              </label>
              <p className="text-lg font-bold text-blue-600">
                {booking.quantity}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Rate per Item
              </label>
              <p className="text-lg font-medium">
                ₹{booking.rate.toLocaleString("en-IN")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Item
                </label>
                <p className="text-lg">{booking.souvenir?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Quantity
                </label>
                <p className="text-lg">{booking.quantity}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Rate per Item
                </label>
                <p className="text-lg">
                  ₹{booking.rate.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Subtotal
                </label>
                <p className="text-lg">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <label className="text-lg font-semibold">Total Amount</label>
              <p className="text-2xl font-bold text-green-600">
                ₹{totalAmount.toLocaleString("en-IN")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Message */}
        {booking.message && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Customer Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {booking.message}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SouvenirBookingView;
