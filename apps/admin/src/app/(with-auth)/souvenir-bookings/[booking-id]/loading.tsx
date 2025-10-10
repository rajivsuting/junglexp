import FormCardSkeleton from "@/components/form-card-skeleton";
import PageLoadingContainer from "@/components/layout/page-loading-container";

export default function Loading() {
  return (
    <PageLoadingContainer>
      <FormCardSkeleton />
    </PageLoadingContainer>
  );
}
