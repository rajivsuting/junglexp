"use client";
import { Text } from 'lucide-react';
import Image from 'next/image';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';

import { CellAction } from './cell-action';

import type { Column, ColumnDef } from "@tanstack/react-table";
import type { TSouvenir } from "@repo/db/index";

export const columns: ColumnDef<TSouvenir>[] = [
  {
    accessorKey: "images",
    header: "IMAGE",
    cell: ({ row }) => {
      const url = (row.getValue("images") as any)?.[0]?.image?.small_url;

      return (
        <div className="relative w-10 aspect-square">
          <Image
            unoptimized
            src={url}
            alt={row.getValue("name")}
            fill
            className="rounded-md"
          />
        </div>
      );
    },
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }: { column: Column<TSouvenir, unknown> }) => (
      <DataTableColumnHeader column={column} title="NAME" />
    ),
    cell: ({ cell }) => (
      <div className="max-w-[300px] truncate">
        {cell.getValue<TSouvenir["name"]>()}
      </div>
    ),
    meta: {
      label: "Destination Name",
      placeholder: "Search destinations...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    id: "park",
    accessorKey: "park",
    header: ({ column }: { column: Column<TSouvenir, unknown> }) => (
      <DataTableColumnHeader column={column} title="PARK NAME" />
    ),
    cell: ({ cell }) => {
      const city = cell.getValue<TSouvenir["park"]>();
      return (
        <div className="max-w-[300px] truncate">
          {city.name} - {city.name}
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Park Name",

      // variant: "multiSelect",
      // options: CATEGORY_OPTIONS,
    },
  },
  {
    accessorKey: "price",
    header: "PRICE",
  },
  {
    accessorKey: "quantity",
    header: "QUANTITY",
  },
  {
    accessorKey: "description",
    header: "DESCRIPTION",
    size: 300,
    maxSize: 300,
    cell: ({ cell }) => (
      <div className="max-w-[300px] truncate">
        {cell.getValue<TSouvenir["description"]>()}
      </div>
    ),
  },
  {
    accessorKey: "is_available",
    header: "STOCK AVAILABLE",
    cell: ({ cell }) => (
      <div className="max-w-[300px] truncate">
        {cell.getValue<TSouvenir["quantity"]>() > 0 ? "YES" : "NO"}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
