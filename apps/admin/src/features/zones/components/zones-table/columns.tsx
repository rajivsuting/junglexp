"use client";
import { Search } from "lucide-react";

import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { getNationalParks } from "@repo/actions/parks.actions";

import { CellAction } from "./cell-action";

import type { Column, ColumnDef } from "@tanstack/react-table";
import type { TZone } from "@repo/db/index";
export const columns: ColumnDef<TZone>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div>{row.original.id}</div>,
    enableColumnFilter: false,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }: { column: Column<TZone, unknown> }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<TZone["name"]>()}</div>,
    meta: {
      label: "Zone Name",
      placeholder: "Search zones...",
      variant: "text",
      icon: Search,
    },
    enableColumnFilter: true,
  },
  {
    id: "description",
    accessorKey: "description",
    header: ({ column }: { column: Column<TZone, unknown> }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),

    cell: ({ cell }) => (
      <div className="max-w-[250px] truncate">
        {cell.getValue<TZone["description"]>()}
      </div>
    ),
  },
  {
    id: "park",
    accessorKey: "park",
    header: ({ column }: { column: Column<TZone, unknown> }) => (
      <DataTableColumnHeader column={column} title="Park" />
    ),
    cell: ({ cell }) => {
      const park = cell.getValue<TZone["park"]>();
      return park.name;
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
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
