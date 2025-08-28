"use client";

import Link from "next/link";
import { parseAsInteger, useQueryState } from "nuqs";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/table/data-table";
import { DataTableToolbar } from "@/components/ui/table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";

import type { ColumnDef } from "@tanstack/react-table";
import type { TRoom } from "@repo/db/schema/types";

interface RoomsTableProps {
  data: TRoom[];
  totalItems: number;
  columns: ColumnDef<TRoom>[];
}

export function RoomsTable({ data, totalItems, columns }: RoomsTableProps) {
  const [pageSize] = useQueryState("perPage", parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    enableAdvancedFilter: false,
    pageCount,

    initialState: {
      sorting: [{ id: "id", desc: false }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}`,
    shallow: false,
    clearOnDefault: true,
  });

  const deleteSelectedRows = useCallback(() => {
    // TODO: Implement bulk delete functionality
    console.log("Delete selected rooms");
  }, []);

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <Link href="/rooms/new">
          <Button>Create Room</Button>
        </Link>
      </DataTableToolbar>
    </DataTable>
  );
}
