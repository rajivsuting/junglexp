"use client";
import { CalendarDays, Mail, Palmtree, Phone, Text, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';

import { CellAction } from './cell-action';

import type { Column, ColumnDef } from "@tanstack/react-table";
import type { TActivityBookingBase } from "@repo/db/schema/activity-bookings";

export type ActivityBookingWithRelations = TActivityBookingBase & {
  activity?: {
    id: number;
    name: string;
    slug: string;
  } | null;
};

export const columns: ColumnDef<ActivityBookingWithRelations>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({
      column,
    }: {
      column: Column<ActivityBookingWithRelations, unknown>;
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
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    cell: ({ cell }) => (
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {cell.getValue<string>()}
        </span>
      </div>
    ),
  },
  {
    id: "mobile",
    accessorKey: "mobile",
    header: "Mobile",
    cell: ({ cell }) => (
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono text-sm">{cell.getValue<string>()}</span>
      </div>
    ),
  },
  {
    id: "activity",
    accessorKey: "activity",
    header: ({
      column,
    }: {
      column: Column<ActivityBookingWithRelations, unknown>;
    }) => <DataTableColumnHeader column={column} title="Activity" />,
    cell: ({ row }) => {
      const activity = row.original.activity;
      return (
        <div className="flex items-center gap-2">
          <Palmtree className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{activity?.name || "N/A"}</span>
        </div>
      );
    },
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    id: "preferredDate",
    accessorKey: "preferredDate",
    header: ({
      column,
    }: {
      column: Column<ActivityBookingWithRelations, unknown>;
    }) => <DataTableColumnHeader column={column} title="Preferred Date" />,
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
      label: "Preferred Date",
      variant: "date",
      icon: CalendarDays,
    },
    enableSorting: false,
  },
  {
    id: "guests",
    header: "Guests",
    cell: ({ row }) => {
      const adults = row.original.numberOfAdults;
      const kids = row.original.numberOfKids;

      return (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm">
            <div>{adults + kids} guests</div>
            <div className="text-muted-foreground text-xs">
              {adults} adults, {kids} kids
            </div>
          </div>
        </div>
      );
    },
  },
  {
    id: "message",
    accessorKey: "message",
    header: "Message",
    cell: ({ cell }) => (
      <div className="text-sm max-w-[200px] truncate text-muted-foreground">
        {cell.getValue<string>() || "-"}
      </div>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({
      column,
    }: {
      column: Column<ActivityBookingWithRelations, unknown>;
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
                : "bg-red-100 text-white hover:bg-red-200"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
    enableSorting: false,
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
