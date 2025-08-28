"use client";
import { Text } from "lucide-react";
import Image from "next/image";

import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { getHotels } from "@repo/actions/hotels.actions";

import { CellAction } from "./cell-action";

import type { Column, ColumnDef } from "@tanstack/react-table";
import type { TRoom } from "@repo/db/schema/types";

export const columns: ColumnDef<TRoom>[] = [
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
    header: ({ column }: { column: Column<TRoom, unknown> }) => (
      <DataTableColumnHeader column={column} title="Room Name" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<TRoom["name"]>()}</div>,
    meta: {
      label: "Room Name",
      placeholder: "Search rooms...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    id: "hotel",
    accessorKey: "hotel",
    header: ({ column }: { column: Column<TRoom, unknown> }) => (
      <DataTableColumnHeader column={column} title="Hotel" />
    ),
    cell: ({ cell }) => {
      const hotel = cell.getValue<TRoom["hotel"]>();
      return <div>{hotel?.name}</div>;
    },
    enableColumnFilter: true,
    meta: {
      label: "Hotel Name",
      placeholder: "Search by hotel...",
      icon: Text,
      variant: "asyncMultiSelect",
      fetchOptions: async () => {
        const res = await getHotels({});
        return res.hotels.map((p) => ({
          value: p.id.toString(),
          label: p.name,
          description:
            [p.zone?.name, p.zone?.park?.name].filter(Boolean).join(" • ") ||
            "No zone assigned",
        }));
      },
      searchOptions: async (query) => {
        const res = await getHotels({ search: query });
        return res.hotels.map((p) => ({
          value: p.id.toString(),
          label: p.name,
          description:
            [p.zone?.name, p.zone?.park?.name].filter(Boolean).join(" • ") ||
            "No zone assigned",
        }));
      },
    },
  },
  {
    id: "capacity",
    accessorKey: "capacity",
    header: ({ column }: { column: Column<TRoom, unknown> }) => (
      <DataTableColumnHeader column={column} title="Capacity" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<TRoom["capacity"]>()} guests</div>,
  },
  {
    id: "room_qty",
    accessorKey: "room_qty",
    header: ({ column }: { column: Column<TRoom, unknown> }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<TRoom["room_qty"]>()} rooms</div>,
  },
  {
    id: "zone",
    accessorKey: "zone",
    header: ({ column }: { column: Column<TRoom, unknown> }) => (
      <DataTableColumnHeader column={column} title="Zone" />
    ),
    cell: ({ cell }) => {
      const zone = cell.row.original.hotel?.zone?.name;
      return <div>{zone}</div>;
    },
    enableColumnFilter: true,
    meta: {
      label: "Zone",
    },
  },
  {
    id: "park",
    accessorKey: "park",
    header: ({ column }: { column: Column<TRoom, unknown> }) => (
      <DataTableColumnHeader column={column} title="Park" />
    ),
    cell: ({ cell }) => {
      const parkName = cell.row.original.hotel?.zone?.park?.name;
      return <div>{parkName}</div>;
    },
    enableColumnFilter: true,
    meta: {
      label: "Park",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
