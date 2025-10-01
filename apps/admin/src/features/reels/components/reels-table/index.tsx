"use client";

import Link from 'next/link';
import { parseAsInteger, useQueryState } from 'nuqs';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';

import type { ColumnDef } from "@tanstack/react-table";
import type { TReelBase } from "@repo/db/schema/reels";

type TReelRow = TReelBase & { activity?: { id: number; name: string } | null };

interface ReelsTableProps {
  data: TReelRow[];
  totalItems: number;
  columns: ColumnDef<TReelRow>[];
}

export function ReelsTable({ data, totalItems, columns }: ReelsTableProps) {
  const [pageSize] = useQueryState("perPage", parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    enableAdvancedFilter: false,
    pageCount,
    getRowId: (originalRow, index) => `${originalRow.id}`,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <Link href="/reels/new">
          <Button>Create Reel</Button>
        </Link>
      </DataTableToolbar>
    </DataTable>
  );
}
