import { Mail, Text, UserCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";

import { getUserRoles } from "../user-form";
import { CellAction } from "./cell-action";

import type { Column, ColumnDef } from "@tanstack/react-table";
import type { TUser } from "@repo/db";
import type { User } from "@clerk/nextjs/server";
const rolesMap: Record<string, string> = {
  user: "User",
  admin: "Admin",
  super_admin: "Super Admin",
};

const rolesVariantMap = {
  user: "outline",
  admin: "secondary",
  super_admin: "destructive",
} as const;

export const columns: (user: User) => ColumnDef<TUser>[] = (_user) => [
  {
    id: "avatar",
    header: "",
    size: 40,
    cell: ({ row }) => {
      const user = row.original;
      const initials =
        `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase();

      return (
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
          {initials || <UserCheck className="h-4 w-4 text-primary" />}
        </div>
      );
    },
  },
  {
    id: "name",
    accessorKey: "first_name",
    header: ({ column }: { column: Column<TUser, unknown> }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      const isSameUser = _user.id === user.user_id;
      const currentUserRole = _user.publicMetadata.role as string;
      const targetUserRole = user.user_role;

      const isRestricted =
        isSameUser ||
        (targetUserRole === "super_admin" && currentUserRole !== "super_admin");

      return (
        <div className="flex flex-col">
          <div
            className={`font-medium flex items-center gap-2 ${isRestricted ? "text-muted-foreground" : ""}`}
          >
            {user.first_name} {user.last_name}
            {isSameUser && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                You
              </span>
            )}
            {targetUserRole === "super_admin" &&
              currentUserRole !== "super_admin" && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                  Protected
                </span>
              )}
          </div>
        </div>
      );
    },
    meta: {
      label: "Name",
      placeholder: "Search by name...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    id: "email",
    accessorKey: "email",
    header: ({ column }: { column: Column<TUser, unknown> }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ cell }) => {
      const email = cell.getValue<string>();
      return (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm">{email}</span>
        </div>
      );
    },
    meta: {
      label: "Email",
      placeholder: "Search by email...",
      variant: "text",
      icon: Mail,
    },
    enableColumnFilter: true,
  },
  {
    id: "role",
    accessorKey: "role",
    header: ({ column }: { column: Column<TUser, unknown> }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ cell }) => {
      const roleValue = cell.row.original.user_role;

      return (
        <Badge
          variant={rolesVariantMap[roleValue as keyof typeof rolesVariantMap]}
        >
          {rolesMap[roleValue]}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Role",
      variant: "select",
      options: getUserRoles().map((role) => ({
        value: role.value.toString(),
        label: role.label,
      })),
    },
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: ({ column }: { column: Column<TUser, unknown> }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ cell }) => {
      const date = cell.getValue<string>();
      return (
        <div className="text-sm text-muted-foreground">
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    id: "updated_at",
    accessorKey: "updated_at",
    header: ({ column }: { column: Column<TUser, unknown> }) => (
      <DataTableColumnHeader column={column} title="Updated" />
    ),
    cell: ({ cell }) => {
      const date = cell.getValue<string>();
      return (
        <div className="text-sm text-muted-foreground">
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} user={_user} />,
  },
];
