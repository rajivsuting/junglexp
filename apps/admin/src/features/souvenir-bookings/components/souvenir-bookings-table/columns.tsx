"use client";
import { Mail, Phone, ShoppingBag, Text } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";

import { CellAction } from "./cell-action";

import type { Column, ColumnDef } from "@tanstack/react-table";
import type { TSouvenirBookingBase } from "@repo/db/schema/souvenir-bookings";

export type SouvenirBookingWithRelations = TSouvenirBookingBase & {
  souvenir?: {
    id: number;
    name: string;
    price: number;
  } | null;
};

export const columns: ColumnDef<SouvenirBookingWithRelations>[] = [
  // {
  //   id: "id",
  //   accessorKey: "id",
  //   header: "Booking ID",
  //   size: 100,
  //   cell: ({ row }) => (
  //     <div className="font-mono text-xs">{row.original.id}</div>
  //   ),
  // },
  {
    id: "name",
    accessorKey: "name",
    header: ({
      column,
    }: {
      column: Column<SouvenirBookingWithRelations, unknown>;
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
    id: "souvenir",
    accessorKey: "souvenir",
    header: ({
      column,
    }: {
      column: Column<SouvenirBookingWithRelations, unknown>;
    }) => <DataTableColumnHeader column={column} title="Souvenir" />,
    cell: ({ row }) => {
      const souvenir = row.original.souvenir;
      return (
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{souvenir?.name || "N/A"}</span>
        </div>
      );
    },
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    id: "quantity",
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ cell }) => (
      <div className="text-center">
        <span className="font-semibold">{cell.getValue<number>()}</span>
      </div>
    ),
  },
  {
    id: "rate",
    accessorKey: "rate",
    header: "Rate",
    cell: ({ cell }) => (
      <div className="font-medium">
        ₹{cell.getValue<number>().toLocaleString("en-IN")}
      </div>
    ),
  },
  {
    id: "message",
    accessorKey: "message",
    header: "Message",
    cell: ({ cell }) => (
      <div className="text-sm max-w-[200px] text-muted-foreground">
        {cell.getValue<string>()}
      </div>
    ),
  },
  {
    id: "total",
    header: "Total Amount",
    cell: ({ row }) => {
      const quantity = row.original.quantity;
      const rate = row.original.rate;
      const total = quantity * rate;

      return (
        <div className="font-bold text-green-600">
          ₹{total.toLocaleString("en-IN")}
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
      column: Column<SouvenirBookingWithRelations, unknown>;
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
