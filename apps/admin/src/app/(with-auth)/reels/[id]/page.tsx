import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import ReelForm from '@/features/reels/reel-form';
import { getReelById } from '@repo/actions/reels.actions';

type Props = { params: Promise<{ id: string }> };

const EditReelPage = async (props: Props) => {
  const params = await props.params;
  const reel = await getReelById(params.id);

  if (!reel) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <ReelForm initialData={reel} pageTitle="Update Reel" />;
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default EditReelPage;
