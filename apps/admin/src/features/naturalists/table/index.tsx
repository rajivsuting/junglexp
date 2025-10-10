"use client";

import Link from "next/link";
import { parseAsInteger, useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/table/data-table";
import { DataTableToolbar } from "@/components/ui/table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";

import type { ColumnDef } from "@tanstack/react-table";
import type { TNaturalist } from "@repo/db/index";

interface NaturalistsTableProps {
  data: TNaturalist[];
  totalItems: number;
  columns: ColumnDef<TNaturalist>[];
}

export const NaturalistsTable: React.FC<NaturalistsTableProps> = ({
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
    getRowId: (row) => `${row.id}`,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <Link href="/naturalists/new">
          <Button>Create Naturalist</Button>
        </Link>
      </DataTableToolbar>
    </DataTable>
  );
};
