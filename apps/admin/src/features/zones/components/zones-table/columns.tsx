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

      // Tell the toolbar “this column has a select filter; here’s how to populate it”
      // populateFn: populateParks,
      // // Store only the park id in the column filter
      // toFilterValue: (opt) => opt.value,
      // // Render label in the toolbar button for either an option or a raw filter value
      // showFn: (v) => {
      //   // If toolbar passes an option, prefer its label
      //   if (v && typeof v === "object" && "label" in (v as any)) {
      //     return (v as SelectOption).label;
      //   }
      //   // Otherwise v is probably the saved id; show id as fallback until resolved
      //   return String(v ?? "Select park");
      // },
      // // Resolve id -> name when options aren’t loaded (e.g., after refresh)
      // fromFilterValueToLabel: async (value: unknown) => {
      //   if (!value) return null;
      //   const res = await fetch(`/api/parks/${value}`, { cache: "no-store" });
      //   if (!res.ok) return null;
      //   const park = await res.json();
      //   return park?.name ?? null;
      // },
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
