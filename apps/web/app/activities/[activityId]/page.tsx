import { ActivityDetail } from '@/components/activity-detail';
import { Footer } from '@/components/footer';

export default function ActivityDetailPage({
  params,
}: {
  params: { activityId: string };
}) {
  return (
    <div className="min-h-screen bg-background">
      <ActivityDetail activityId={params.activityId} />
      <Footer />
    </div>
  );
}
