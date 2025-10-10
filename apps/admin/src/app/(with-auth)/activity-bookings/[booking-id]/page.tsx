import { notFound } from 'next/navigation';

import PageContainer from '@/components/layout/page-container';
import { getActivityBookingById } from '@repo/actions/activity-bookings.actions';

import ActivityBookingView from './booking-view';

interface ActivityBookingPageProps {
  params: Promise<{ "booking-id": string }>;
}

const ActivityBookingPage = async (props: ActivityBookingPageProps) => {
  const params = await props.params;
  const bookingId = params["booking-id"];

  if (!bookingId) {
    notFound();
  }

  const booking = await getActivityBookingById(bookingId);

  if (!booking) {
    notFound();
  }

  return (
    <PageContainer scrollable={true}>
      <ActivityBookingView booking={booking as any} />
    </PageContainer>
  );
};

export default ActivityBookingPage;
