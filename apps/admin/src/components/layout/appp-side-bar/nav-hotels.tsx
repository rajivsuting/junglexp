"use client";
import { BedDouble, Hotel, Landmark } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Hotels",
    url: "/hotels",
    icon: Hotel,
  },
  {
    title: "Rooms",
    url: "/rooms",
    icon: BedDouble,
  },
  {
    title: "Places",
    url: "/places",
    icon: Landmark,
  },
];

export function NavHotels() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Places</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <Link href={item.url} key={item.title}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === item.url}
                  tooltip={item.title}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
