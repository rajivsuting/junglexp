"use client";

import { Search } from "lucide-react";
import Image from "next/image";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { getNationalParks } from "@repo/actions/parks.actions";

import { CellAction } from "./cell-action";

import type { Column, ColumnDef } from "@tanstack/react-table";
import type { TActivity } from "@repo/db/index";
export const columns: ColumnDef<TActivity>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={Boolean(
          table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
        )}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = row.original.images?.[0]?.image.small_url;
      return (
        <div className="relative w-10 aspect-square">
          {!image ? null : (
            <Image
              src={image}
              alt={row.original.name}
              fill
              unoptimized
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
    header: ({ column }: { column: Column<TActivity, unknown> }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>;
    },
    enableColumnFilter: true,
    meta: {
      label: "Activity Name",
      placeholder: "Search activities...",
      variant: "text",
      icon: Search,
    },
  },
  {
    id: "park",
    accessorKey: "park",

    header: ({ column }: { column: Column<TActivity, unknown> }) => (
      <DataTableColumnHeader column={column} title="National Park" />
    ),
    cell: ({ row }) => {
      const activity = row.original;
      return (
        <div className="text-sm">
          {activity.park?.name || "No park assigned"}
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      placeholder: "Search parks...",
      variant: "asyncMultiSelect",
      label: "Park",

      fetchOptions: async () => {
        const res = await getNationalParks();
        return res.parks.map((p) => ({
          value: p.id.toString(),
          label: p.name,
        }));
      },
      searchOptions: async (query) => {
        const res = await getNationalParks({ search: query });
        return res.parks.map((p) => ({
          value: p.id.toString(),
          label: p.name,
        }));
      },
    },
  },
  {
    id: "is_featured",
    accessorKey: "is_featured",
    header: "Featured",
    cell: ({ row }) => {
      const isFeatured = row.original.is_featured;
      return <div className="text-sm">{isFeatured ? "Yes" : "No"}</div>;
    },
    enableColumnFilter: true,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
