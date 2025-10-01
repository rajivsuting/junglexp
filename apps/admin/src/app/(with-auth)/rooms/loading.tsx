import PageLoadingContainer from '@/components/layout/page-loading-container';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

export default function Loading() {
  return (
    <PageLoadingContainer>
      <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
    </PageLoadingContainer>
  );
}
