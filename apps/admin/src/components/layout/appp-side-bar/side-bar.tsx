import Link from 'next/link';

import {
    Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';

import { Logo } from './Logo';
import { NavActivites } from './nav-activites';
import { NavAdmin } from './nav-admin';
import { NavBookings } from './nav-bookings';
import { NavGlobal } from './nav-global';
import { NavHotels } from './nav-hotels';
import { NavMain } from './nav-main';
import { NavOthers } from './nav-others';
import { NavUser } from './nav-user';

import type { User } from "@clerk/nextjs/server";
export function AppSidebar({ user }: { user: User | null }) {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <Logo />

                {/* <span className="text-base font-semibold">eTroupers</span> */}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavGlobal />
        <NavMain />
        <NavHotels />
        <NavActivites />
        <NavOthers />
        <NavBookings />
        {user?.publicMetadata.role === "super_admin" && <NavAdmin />}
        {/* <NavOthers /> */}
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
