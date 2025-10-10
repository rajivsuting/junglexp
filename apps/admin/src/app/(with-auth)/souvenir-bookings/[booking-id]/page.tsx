import { notFound } from 'next/navigation';

import PageContainer from '@/components/layout/page-container';
import { getSouvenirBookingById } from '@repo/actions/souvenir-bookings.actions';

import SouvenirBookingView from './booking-view';

interface SouvenirBookingPageProps {
  params: Promise<{ "booking-id": string }>;
}

const SouvenirBookingPage = async (props: SouvenirBookingPageProps) => {
  const params = await props.params;
  const bookingId = params["booking-id"];

  if (!bookingId) {
    notFound();
  }

  const booking = await getSouvenirBookingById(bookingId);

  if (!booking) {
    notFound();
  }

  return (
    <PageContainer scrollable={true}>
      <SouvenirBookingView booking={booking as any} />
    </PageContainer>
  );
};

export default SouvenirBookingPage;
