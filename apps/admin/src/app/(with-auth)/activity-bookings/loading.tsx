import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

export default function Loading() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <DataTableSkeleton columnCount={9} rowCount={8} filterCount={3} />
    </div>
  );
}
