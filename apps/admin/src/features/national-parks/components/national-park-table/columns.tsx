"use client";
import { Text } from 'lucide-react';
import Image from 'next/image';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';

import { CellAction } from './cell-action';

import type { Column, ColumnDef } from "@tanstack/react-table";
import type { TNationalPark, TParkImage } from "@repo/db/index";

export const columns: ColumnDef<TNationalPark>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
    size: 50,
    cell: ({ row }) => <div>{row.original.id}</div>,
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const img = row.original.images?.[0]?.image.small_url;
      return (
        <div className="relative w-10 aspect-square">
          {!img ? (
            <div className="w-full h-full bg-gray-200 rounded-md"></div>
          ) : (
            <Image
              src={img}
              unoptimized
              alt={row.getValue("name")}
              fill
              className="rounded-md"
            />
          )}
        </div>
      );
    },
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }: { column: Column<TNationalPark, unknown> }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<TNationalPark["name"]>()}</div>,
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
    header: ({ column }: { column: Column<TNationalPark, unknown> }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ cell }) => {
      const city = cell.getValue<TNationalPark["city"]>();
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
