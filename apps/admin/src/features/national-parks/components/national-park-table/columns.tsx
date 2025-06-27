"use client";
import { Text } from 'lucide-react';
import Image from 'next/image';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';

import { CellAction } from './cell-action';

import type { Column, ColumnDef } from "@tanstack/react-table";
import type { TNationalParkWithCity } from "@repo/db/index";

export const columns: ColumnDef<TNationalParkWithCity>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      return (
        <div className="relative w-10 aspect-square">
          <Image
            src={row.getValue("image")}
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
    header: ({ column }: { column: Column<TNationalParkWithCity, unknown> }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<TNationalParkWithCity["name"]>()}</div>
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
    id: "city",
    accessorKey: "city",
    header: ({ column }: { column: Column<TNationalParkWithCity, unknown> }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ cell }) => {
      const city = cell.getValue<TNationalParkWithCity["city"]>();
      return (
        <div>
          {city.name} - {city.state.name}
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "City",
      // variant: "multiSelect",
      // options: CATEGORY_OPTIONS,
    },
  },
  // {
  //   accessorKey: "price",
  //   header: "PRICE",
  // },
  // {
  //   accessorKey: "description",
  //   header: "DESCRIPTION",
  // },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
