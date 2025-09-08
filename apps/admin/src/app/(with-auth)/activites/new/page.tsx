import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import ActivityForm from "@/features/activities/components/activity-form";

export default function NewActivityPage() {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <ActivityForm pageTitle="Create New Activity" mode="create" />;
        </Suspense>
      </div>
    </PageContainer>
  );
}
