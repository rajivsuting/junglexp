"use client";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CellAction } from "./cell-action";

import type { Column, ColumnDef } from "@tanstack/react-table";
import type { TNaturalistBase } from "@repo/db/schema/naturalist";
import type { TNaturalist } from "@repo/db/index";

export const columns: ColumnDef<TNaturalist>[] = [
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
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
  {
    accessorKey: "activity_ids",
    header: "Activities",
    cell: ({ cell }) => {
      const activities = cell.row.original.naturalistActivities || [];

      if (activities.length === 0) {
        return (
          <span className="text-sm text-muted-foreground italic">
            No activities
          </span>
        );
      }

      const visibleCount = 2;
      const visibleActivities = activities.slice(0, visibleCount);
      const remainingCount = activities.length - visibleCount;
      const allActivityNames = activities
        .map((a) => a.activity?.name)
        .filter(Boolean)
        .join(", ");

      return (
        <div className="flex items-center gap-1 flex-wrap max-w-[250px]">
          {visibleActivities.map((activity, index) => (
            <Badge
              key={`${activity.activity?.id}-${index}`}
              variant="secondary"
              className="text-xs"
            >
              {activity.activity?.name}
            </Badge>
          ))}
          {remainingCount > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-xs cursor-help">
                    +{remainingCount} more
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-semibold mb-1">All Activities:</p>
                  <p className="text-sm">{allActivityNames}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );
    },
  },
  { id: "actions", cell: ({ row }) => <CellAction data={row.original} /> },
];
