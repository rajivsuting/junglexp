"use client";
import Image from 'next/image';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';

import { CellAction } from './cell-action';

import type { Column, ColumnDef } from "@tanstack/react-table";
import type { TNaturalistBase } from "@repo/db/schema/naturalist";

export const columns: ColumnDef<TNaturalistBase>[] = [
  { id: "id", accessorKey: "id", header: "ID", size: 50 },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = (row.original as any).image;
      if (!image) {
        return (
          <div className="relative w-10 aspect-square bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-xs text-gray-500">No image</span>
          </div>
        );
      }
      return (
        <div className="relative w-10 aspect-square">
          <Image
            src={image.small_url}
            alt={image.alt_text || row.getValue("name")}
            unoptimized
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
    header: ({ column }: { column: Column<TNaturalistBase, unknown> }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<TNaturalistBase["name"]>()}</div>,
    meta: {
      label: "Name",
      placeholder: "Search naturalists...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ cell }) => {
      const description = cell.getValue<TNaturalistBase["description"]>();
      return (
        <div className="max-w-[300px] truncate" title={description}>
          {description}
        </div>
      );
    },
  },
  { id: "actions", cell: ({ row }) => <CellAction data={row.original} /> },
];
