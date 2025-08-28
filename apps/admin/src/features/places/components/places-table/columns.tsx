"use client";
import { MapPin, Text } from "lucide-react";
import Image from "next/image";

import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";

import { CellAction } from "./cell-action";

import type { Column, ColumnDef } from "@tanstack/react-table";
import type { TPlaceBase } from "@repo/db/index";

export const columns: ColumnDef<TPlaceBase>[] = [
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
      const images = (row.original as any).images;
      const firstImage = images?.[0]?.image;

      if (!firstImage) {
        return (
          <div className="relative w-10 aspect-square bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-xs text-gray-500">No image</span>
          </div>
        );
      }

      return (
        <div className="relative w-10 aspect-square">
          <Image
            src={firstImage.small_url}
            unoptimized
            alt={firstImage.alt_text || row.getValue("name")}
            fill
            className="rounded-md object-cover"
          />
        </div>
      );
    },
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }: { column: Column<TPlaceBase, unknown> }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<TPlaceBase["name"]>()}</div>,
    meta: {
      label: "Place Name",
      placeholder: "Search places...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Description",
    cell: ({ cell }) => {
      const description = cell.getValue<TPlaceBase["description"]>();
      return (
        <div className="max-w-[300px] truncate" title={description}>
          {description}
        </div>
      );
    },
  },
  // {
  //   id: "slug",
  //   accessorKey: "slug",
  //   header: "Slug",
  //   cell: ({ cell }) => {
  //     const slug = cell.getValue<TPlaceBase["slug"]>();
  //     return (
  //       <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
  //         {slug}
  //       </div>
  //     );
  //   },
  // },
  // {
  //   id: "location",
  //   accessorKey: "location",
  //   header: ({ column }: { column: Column<TPlaceBase, unknown> }) => (
  //     <DataTableColumnHeader column={column} title="Location" />
  //   ),
  //   cell: ({ row }) => {
  //     const location = row.original.location;
  //     if (!location) return <div className="text-gray-400">No coordinates</div>;
  //
  //     // Extract coordinates from geometry if available
  //     // This is a simplified display - you might want to format this better
  //     return (
  //       <div className="flex items-center gap-2">
  //         <MapPin className="h-4 w-4 text-gray-500" />
  //         <span className="text-sm text-gray-600">Coordinates set</span>
  //       </div>
  //     );
  //   },
  //   meta: {
  //     label: "Location",
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
