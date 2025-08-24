"use client";

import Link from 'next/link';
import { parseAsInteger, useQueryState } from 'nuqs';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';

import type { ColumnDef } from "@tanstack/react-table";

interface NationalParkTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
}

export function NationalParkTable<TData, TValue>({
  data,
  totalItems,
  columns,
}: NationalParkTableParams<TData, TValue>) {
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
      <DataTableToolbar table={table}>
        <Link href="/national-parks/new">
          <Button>Create National Park</Button>
        </Link>
      </DataTableToolbar>
    </DataTable>
  );
}
