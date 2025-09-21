"use client";

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteUser } from "@repo/actions/users.actions";

import type { TUser } from "@repo/db";
import type { User } from "@clerk/nextjs/server";

interface CellActionProps {
  data: TUser;
  user: User;
}

export const CellAction: React.FC<CellActionProps> = ({ data, user }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onConfirm = async () => {
    if (!confirm(`Are you sure you want to delete user "${data.email}"?`)) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteUser(data.user_id);
        if (result.success) {
          toast.success("User deleted successfully");
          router.refresh();
        } else {
          toast.error(result.error || "Failed to delete user");
        }
      } catch (error) {
        toast.error("Failed to delete user");
      }
    });
  };

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("User ID copied to clipboard");
  };

  const isSameUser = user.id === data.user_id;
  const currentUserRole = user.publicMetadata.role as string;
  const targetUserRole = data.user_role;

  // Disable edit/delete if:
  // 1. Same user trying to edit themselves, OR
  // 2. Target user is super_admin AND current user is admin or user (not super_admin)
  const shouldDisableActions =
    isSameUser ||
    (targetUserRole === "super_admin" && currentUserRole !== "super_admin");

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onCopy(data.user_id)}>
          <Copy className="mr-2 h-4 w-4" /> Copy User ID
        </DropdownMenuItem>

        {!shouldDisableActions && (
          <DropdownMenuItem
            onClick={() => router.push(`/users/${data.user_id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit User
          </DropdownMenuItem>
        )}

        {shouldDisableActions && (
          <DropdownMenuItem disabled className="text-muted-foreground">
            <Edit className="mr-2 h-4 w-4" />
            {isSameUser ? "Cannot edit yourself" : "Cannot edit super admin"}
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {!shouldDisableActions && (
          <DropdownMenuItem
            onClick={onConfirm}
            className="text-red-600 focus:text-red-600"
            disabled={isPending}
          >
            <Trash className="mr-2 h-4 w-4" /> Delete User
          </DropdownMenuItem>
        )}

        {shouldDisableActions && (
          <DropdownMenuItem disabled className="text-muted-foreground">
            <Trash className="mr-2 h-4 w-4" />
            {isSameUser
              ? "Cannot delete yourself"
              : "Cannot delete super admin"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
