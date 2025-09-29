"use client";

import { parseAsInteger, useQueryState } from 'nuqs';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';

import type { NaturalistBookingWithRelations } from "./columns";
import type { ColumnDef } from "@tanstack/react-table";

interface NaturalistBookingsTableParams {
  data: NaturalistBookingWithRelations[];
  totalItems: number;
  columns: ColumnDef<NaturalistBookingWithRelations>[];
}

export function NaturalistBookingsTable({
  data,
  totalItems,
  columns,
}: NaturalistBookingsTableParams) {
  const [pageSize] = useQueryState("perPage", parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500,
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
