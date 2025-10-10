"use client";

import {
    ArrowLeft, Calendar, Check, Clock, Mail, MessageSquare, Palmtree, Phone, Users, X
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
import { updateActivityBookingStatus } from '@repo/actions/activity-bookings.actions';

import type { TActivityBookingBase } from "@repo/db/schema/activity-bookings";

type ActivityBooking = TActivityBookingBase & {
  activity: {
    id: number;
    name: string;
    slug: string;
  } | null;
};

interface ActivityBookingViewProps {
  booking: ActivityBooking;
}

const ActivityBookingView: React.FC<ActivityBookingViewProps> = ({
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
      await updateActivityBookingStatus(booking.id, newStatus);
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

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-4">
          <Link href="/activity-bookings">
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

        {/* Activity Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palmtree className="h-5 w-5" />
              Activity Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Activity
              </label>
              <p className="text-lg font-semibold">
                {booking.activity?.name || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Preferred Date
              </label>
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg">
                  {formatDate(booking.preferredDate)}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Guest Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Guest Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Adults
                </label>
                <p className="text-2xl font-bold text-blue-600">
                  {booking.numberOfAdults}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Children
                </label>
                <p className="text-2xl font-bold text-green-600">
                  {booking.numberOfKids}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Total Guests
                </label>
                <p className="text-2xl font-bold">
                  {booking.numberOfAdults + booking.numberOfKids}
                </p>
              </div>
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

export default ActivityBookingView;
