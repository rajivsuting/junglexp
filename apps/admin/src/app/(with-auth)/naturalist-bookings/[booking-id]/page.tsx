import { notFound } from "next/navigation";

import PageContainer from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNaturalistBookingById } from "@repo/actions/naturalist-bookings.actions";

interface NaturalistBookingDetailPageProps {
  params: Promise<{ "booking-id": string }>;
}

export default async function NaturalistBookingDetailPage(
  props: NaturalistBookingDetailPageProps
) {
  const params = await props.params;
  const bookingId = parseInt(params["booking-id"]);

  if (isNaN(bookingId)) {
    notFound();
  }

  const booking = await getNaturalistBookingById(bookingId);

  if (!booking) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Naturalist Booking #{booking.id}
            </h1>
            <p className="text-muted-foreground">
              View and manage naturalist booking details
            </p>
          </div>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Name
                </label>
                <p className="font-medium">{booking.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p>{booking.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Mobile Number
                </label>
                <p className="font-mono">{booking.mobile_no}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Safari Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  National Park
                </label>
                <p className="font-medium">{booking.park?.name || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Safari Date
                </label>
                <p>{new Date(booking.date_of_safari).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Time Slot
                </label>
                <Badge variant="outline" className="font-mono">
                  {booking.slot}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Specialized Interest
                </label>
                <p>{booking.specialised_interest}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
