import { Suspense } from 'react';

import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import ReelForm from '@/features/reels/reel-form';

const NewReelPage = async () => {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <ReelForm initialData={null} pageTitle="Create Reel" />;
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default NewReelPage;
