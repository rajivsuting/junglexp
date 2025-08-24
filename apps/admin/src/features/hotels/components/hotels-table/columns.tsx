"use client";
import { log } from "console";
import { Text } from "lucide-react";
import Image from "next/image";

import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";

import { CellAction } from "./cell-action";

import type { Column, ColumnDef } from "@tanstack/react-table";
import type { THotel, THotelImage } from "@repo/db/index";
export const columns: ColumnDef<THotel>[] = [
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
    header: ({ column }: { column: Column<THotel, unknown> }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<THotel["name"]>()}</div>,
    meta: {
      label: "Hotel Name",
      placeholder: "Search hotels...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    id: "zone",
    accessorKey: "zone",
    header: ({ column }: { column: Column<THotel, unknown> }) => (
      <DataTableColumnHeader column={column} title="Zone" />
    ),
    cell: ({ cell }) => {
      const zone = cell.getValue<THotel["zone"]>();

      return <div>{zone.name}</div>;
    },
    enableColumnFilter: true,
    meta: {
      label: "Zone",
      // variant: "multiSelect",
      // options: CATEGORY_OPTIONS,
    },
  },
  {
    id: "park",
    accessorKey: "park",
    header: ({ column }: { column: Column<THotel, unknown> }) => (
      <DataTableColumnHeader column={column} title="Park" />
    ),
    cell: ({ cell }) => {
      const parkName = cell.row.original.zone?.park?.name;

      return <div>{parkName}</div>;
    },
    enableColumnFilter: true,
    meta: {
      label: "Park",
      // variant: "multiSelect",
      // options: CATEGORY_OPTIONS,
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
