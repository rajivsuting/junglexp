import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import ActivityForm from '@/features/activities/components/activity-form';
import { getActivityById } from '@repo/actions/activities.actions';

interface ActivityEditPageProps {
  params: Promise<{
    "activity-id": string;
  }>;
}

export default async function ActivityEditPage({
  params,
}: ActivityEditPageProps) {
  const { "activity-id": _activityId } = await params;
  const activityId = parseInt(_activityId);

  if (isNaN(activityId)) {
    notFound();
  }

  const activity = await getActivityById(activityId);

  if (!activity) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <ActivityForm
            pageTitle="Edit Activity"
            mode="edit"
            activityId={activityId}
            initialData={activity as any}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}
