"use client";

import { LogOut } from "lucide-react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAuth } from "@clerk/nextjs";

const LogoutButton = () => {
  const { signOut } = useAuth();

  const logoutUser = async () => {
    await signOut({ redirectUrl: "/sign-in" });
  };

  return (
    <DropdownMenuItem onClick={logoutUser}>
      <LogOut />
      Log out
    </DropdownMenuItem>
  );
};

export default LogoutButton;
