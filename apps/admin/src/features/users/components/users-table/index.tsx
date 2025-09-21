"use client";

import Link from "next/link";
import { parseAsInteger, useQueryState } from "nuqs";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/table/data-table";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { DataTableToolbar } from "@/components/ui/table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { useUser } from "@clerk/nextjs";

import { columns } from "./columns";

import type { TUser } from "@repo/db";
interface UsersTableProps {
  data: TUser[];
  totalItems: number;
}

export function UsersTable({ data, totalItems }: UsersTableProps) {
  const [pageSize] = useQueryState("perPage", parseAsInteger.withDefault(10));
  const { user } = useUser();

  const pageCount = Math.ceil(totalItems / pageSize);

  // Get columns with current user context
  const tableColumns = user ? columns(user as any) : [];

  const { table } = useDataTable({
    data,
    columns: tableColumns,
    enableAdvancedFilter: false,
    pageCount,
    initialState: {
      sorting: [{ id: "created_at", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}`,
    shallow: false,
    clearOnDefault: true,
  });

  const deleteSelectedRows = useCallback(() => {
    // TODO: Implement bulk delete functionality
    console.log("Delete selected users");
  }, []);

  // Show loading state while user data is loading
  if (!user) {
    return <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />;
  }

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <Link href="/users/new">
          <Button>Create User</Button>
        </Link>
      </DataTableToolbar>
    </DataTable>
  );
}
