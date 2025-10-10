"use client";
import { CalendarDays, Hotel, MapPin, Text, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { getHotels } from "@repo/actions/hotels.actions";

import { CellAction } from "./cell-action";

import type { Column, ColumnDef } from "@tanstack/react-table";
import type { THotelBookingBase } from "@repo/db/schema/hotel-bookings";

export type HotelBookingWithRelations = THotelBookingBase & {
  hotel?: {
    id: number;
    name: string;
  } | null;
  room?: {
    id: number;
    name: string;
  } | null;
};

export const columns: ColumnDef<HotelBookingWithRelations>[] = [
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
      column: Column<HotelBookingWithRelations, unknown>;
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
      <div className="font-mono text-sm">{cell.getValue<number>()}</div>
    ),
  },
  {
    id: "hotel_id",
    accessorKey: "hotel",
    header: ({
      column,
    }: {
      column: Column<HotelBookingWithRelations, unknown>;
    }) => <DataTableColumnHeader column={column} title="Hotel" />,
    cell: ({ row }) => {
      const hotel = row.original.hotel;
      return (
        <div className="flex items-center gap-2">
          <Hotel className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{hotel?.name || "N/A"}</span>
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Hotel",
      variant: "asyncSelect",
      placeholder: "Select hotel to filter...",
      icon: Hotel,
      fetchOptions: async () => {
        const { hotels } = await getHotels({ limit: 1000 });
        return hotels.map((hotel) => ({
          label: hotel.name,
          value: hotel.id?.toString() || "",
        }));
      },
    },
    enableSorting: false,
  },
  {
    id: "room",
    accessorKey: "room",
    header: ({
      column,
    }: {
      column: Column<HotelBookingWithRelations, unknown>;
    }) => <DataTableColumnHeader column={column} title="Room" />,
    cell: ({ row }) => {
      const room = row.original.room;
      return (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{room?.name || "N/A"}</span>
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Room",
    },
    enableSorting: false,
  },
  {
    id: "check_in_date",
    accessorKey: "check_in_date",
    header: ({
      column,
    }: {
      column: Column<HotelBookingWithRelations, unknown>;
    }) => <DataTableColumnHeader column={column} title="Check-in" />,
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
      label: "Check-in Date",
      variant: "date",
      icon: CalendarDays,
    },
    enableSorting: false,
  },
  {
    id: "check_out_date",
    accessorKey: "check_out_date",
    header: ({
      column,
    }: {
      column: Column<HotelBookingWithRelations, unknown>;
    }) => <DataTableColumnHeader column={column} title="Check-out" />,
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
      label: "Check-out Date",
      variant: "date",
      icon: CalendarDays,
    },
    enableSorting: false,
  },
  {
    id: "guests",
    header: "Guests",
    cell: ({ row }) => {
      const adults = row.original.no_of_adults;
      const kids = row.original.no_of_kids;
      const rooms = row.original.no_of_rooms_required;

      return (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm">
            <div>{adults + kids} guests</div>
            <div className="text-muted-foreground">
              {rooms} room{rooms > 1 ? "s" : ""}
            </div>
          </div>
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
      column: Column<HotelBookingWithRelations, unknown>;
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
