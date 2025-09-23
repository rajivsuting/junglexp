import {
    Camera, ChartLine, Compass, Database, File, FileStack, HelpCircle, MapPinHouse, Search, Settings
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import {
    Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

import { NavActivites } from './nav-activites';
import { NavAdmin } from './nav-admin';
import { NavGlobal } from './nav-global';
import { NavHotels } from './nav-hotels';
import { NavMain } from './nav-main';
import { NavPlaces } from './nav-places';
import { NavUser } from './nav-user';

import type { User } from "@clerk/nextjs/server";
const data = {
  navMain: [
    {
      title: "Destinations",
      url: "/destinations",
      icon: MapPinHouse,
    },
    {
      title: "Tours",
      url: "#",
      icon: Compass,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: Camera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: File,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: File,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircle,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: Database,
    },
    {
      name: "Reports",
      url: "#",
      icon: ChartLine,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: FileStack,
    },
  ],
};

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
                <Image
                  src="/LogoWhite.svg"
                  alt="eTroupers"
                  width={100}
                  height={40}
                />
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
        <NavPlaces />
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
