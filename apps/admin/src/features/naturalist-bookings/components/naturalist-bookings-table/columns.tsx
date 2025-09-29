"use client";
import { CalendarDays, Text, TreePine } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { getNationalParks } from "@repo/actions";

import { CellAction } from "./cell-action";

import type { Column, ColumnDef } from "@tanstack/react-table";
import type { TNaturalistBookingBase } from "@repo/db/schema/naturalist-bookings";

export type NaturalistBookingWithRelations = TNaturalistBookingBase & {
  park?: {
    id: number;
    name: string;
  } | null;
};

export const columns: ColumnDef<NaturalistBookingWithRelations>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
    size: 60,
    cell: ({ row }) => <div className="font-mono">{row.original.id}</div>,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({
      column,
    }: {
      column: Column<NaturalistBookingWithRelations, unknown>;
    }) => <DataTableColumnHeader column={column} title="Customer Name" />,
    cell: ({ cell }) => (
      <div className="font-medium">{cell.getValue<string>()}</div>
    ),
    meta: {
      label: "Customer Name",
      placeholder: "Search by customer name...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    cell: ({ cell }) => (
      <div className="text-sm text-muted-foreground">
        {cell.getValue<string>()}
      </div>
    ),
  },
  {
    id: "mobile_no",
    accessorKey: "mobile_no",
    header: "Mobile",
    cell: ({ cell }) => (
      <div className="font-mono text-sm">{cell.getValue<string>()}</div>
    ),
  },
  {
    id: "park_id",
    accessorKey: "park",
    header: ({
      column,
    }: {
      column: Column<NaturalistBookingWithRelations, unknown>;
    }) => <DataTableColumnHeader column={column} title="National Park" />,
    cell: ({ row }) => {
      const park = row.original.park;
      return (
        <div className="flex items-center gap-2">
          <TreePine className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{park?.name || "N/A"}</span>
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "National Park",
      variant: "asyncSelect",
      placeholder: "Select park to filter...",
      icon: TreePine,
      fetchOptions: async () => {
        const { parks } = await getNationalParks({ limit: 1000 });
        return parks.map((park) => ({
          label: park.name,
          value: park.id?.toString() || "",
        }));
      },
    },
  },
  {
    id: "date_of_safari",
    accessorKey: "date_of_safari",
    header: ({
      column,
    }: {
      column: Column<NaturalistBookingWithRelations, unknown>;
    }) => <DataTableColumnHeader column={column} title="Safari Date" />,
    cell: ({ cell }) => {
      const date = cell.getValue<string>();
      return (
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Safari Date",
      variant: "dateRange",
      icon: CalendarDays,
    },
  },
  {
    id: "slot",
    accessorKey: "slot",
    header: "Time Slot",
    cell: ({ cell }) => (
      <Badge variant="outline" className="font-mono">
        {cell.getValue<string>()}
      </Badge>
    ),
    enableColumnFilter: true,
    meta: {
      label: "Time Slot",
      variant: "multiSelect",
      options: [
        { label: "Morning", value: "morning" },
        { label: "Afternoon", value: "afternoon" },
        { label: "Evening", value: "evening" },
      ],
    },
  },
  {
    id: "specialised_interest",
    accessorKey: "specialised_interest",
    header: "Specialization",
    cell: ({ cell }) => {
      const interest = cell.getValue<string>();
      return (
        <div className="max-w-[200px] truncate" title={interest}>
          {interest}
        </div>
      );
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({
      column,
    }: {
      column: Column<NaturalistBookingWithRelations, unknown>;
    }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ cell }) => {
      const status = cell.getValue<string>();
      return (
        <Badge
          variant={
            status === "confirmed"
              ? "default"
              : status === "pending"
                ? "secondary"
                : "destructive"
          }
          className={
            status === "confirmed"
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : status === "pending"
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                : "bg-red-100 text-red-800 hover:bg-red-200"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Status",
      variant: "multiSelect",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
