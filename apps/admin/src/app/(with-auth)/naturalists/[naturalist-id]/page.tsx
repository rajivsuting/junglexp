import { Suspense } from 'react';

import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import NaturalistViewPage from '@/features/naturalists/components/naturalist-view-page';

interface Props {
  params: Promise<{ "naturalist-id": string }>;
}

const NaturalistEditPage = async ({ params }: Props) => {
  const { "naturalist-id": id } = await params;

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <NaturalistViewPage
            pageTitle={id !== "new" ? "Edit Naturalist" : "Create Naturalist"}
            mode={id !== "new" ? "edit" : "create"}
            id={id}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default NaturalistEditPage;
