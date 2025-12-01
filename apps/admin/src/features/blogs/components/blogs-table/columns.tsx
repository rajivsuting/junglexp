"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { CellAction } from "./cell-action";
import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import type { TBlog, TBlogCategory } from "@repo/db/index";
import { Search } from "lucide-react";

type BlogWithThumbnail = TBlog & {
  thumbnail: {
    small_url: string;
    medium_url: string;
    large_url: string;
    original_url: string;
    alt_text: string;
  } | null;
  category: TBlogCategory;
};

export const columns: ColumnDef<BlogWithThumbnail>[] = [
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
    accessorKey: "thumbnail",
    header: "Thumbnail",
    cell: ({ row }) => {
      const image =
        row.original.thumbnail?.small_url ||
        row.original.thumbnail?.medium_url ||
        row.original.thumbnail?.original_url;
      return (
        <div className="relative w-10 aspect-square">
          {!image ? null : (
            <Image
              src={image}
              alt={row.original.title}
              fill
              unoptimized
              className="rounded-md object-cover"
            />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
    enableColumnFilter: true,
    meta: {
      label: "Title",
      placeholder: "Search blogs...",
      variant: "text",
      icon: Search,
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.category?.name}</div>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
