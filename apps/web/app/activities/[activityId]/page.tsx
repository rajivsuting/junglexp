import type { PageProps } from "@/.next/types/app/page";
import { ActivityDetail } from "@/components/activity-detail";
import { Footer } from "@/components/footer";

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ activityId: string }>;
}) {
  const { activityId } = await params;
  return (
    <div className="min-h-screen bg-background">
      <ActivityDetail activityId={activityId} />
      <Footer />
    </div>
  );
}
