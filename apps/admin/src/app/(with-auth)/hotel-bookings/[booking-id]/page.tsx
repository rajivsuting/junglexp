import { log } from "console";
import { notFound } from "next/navigation";

import PageContainer from "@/components/layout/page-container";
import { getHotelBookingById } from "@repo/actions/hotel-bookings.action";

import HotelBookingView from "./booking-view";

interface HotelBookingPageProps {
  params: Promise<{ "booking-id": string }>;
}

const HotelBookingPage = async (props: HotelBookingPageProps) => {
  const params = await props.params;
  const bookingId = Number.parseInt(params["booking-id"]);

  if (Number.isNaN(bookingId)) {
    notFound();
  }

  const booking = await getHotelBookingById(bookingId);

  if (!booking) {
    notFound();
  }

  return (
    <PageContainer scrollable={true}>
      <HotelBookingView booking={booking as any} />
    </PageContainer>
  );
};

export default HotelBookingPage;
