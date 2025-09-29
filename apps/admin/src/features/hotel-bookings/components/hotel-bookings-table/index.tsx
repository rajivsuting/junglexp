"use client";

import { parseAsInteger, useQueryState } from 'nuqs';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';

import type { HotelBookingWithRelations } from "./columns";
import type { ColumnDef } from "@tanstack/react-table";

interface HotelBookingsTableParams {
  data: HotelBookingWithRelations[];
  totalItems: number;
  columns: ColumnDef<HotelBookingWithRelations>[];
}

export function HotelBookingsTable({
  data,
  totalItems,
  columns,
}: HotelBookingsTableParams) {
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
