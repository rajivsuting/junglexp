"use client";

import Link from "next/link";
import { parseAsInteger, useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/table/data-table";
import { DataTableToolbar } from "@/components/ui/table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";

import type { TPlaceBase } from "@repo/db/index";
import type { ColumnDef } from "@tanstack/react-table";
interface PlacesTableProps {
  data: TPlaceBase[];
  totalItems: number;
  columns: ColumnDef<TPlaceBase>[];
}

export const PlacesTable: React.FC<PlacesTableProps> = ({
  data,
  totalItems,
  columns,
}) => {
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

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <Link href="/places/new">
          <Button>Create Place</Button>
        </Link>
      </DataTableToolbar>
    </DataTable>
  );
};
