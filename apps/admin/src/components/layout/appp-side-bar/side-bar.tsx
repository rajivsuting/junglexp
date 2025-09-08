import {
  Camera,
  ChartLine,
  Compass,
  Database,
  File,
  FileStack,
  HelpCircle,
  MapPinHouse,
  Search,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

import { NavActivites } from "./nav-activites";
import { NavDocuments } from "./nav-documents";
import { NavGlobal } from "./nav-global";
import { NavHotels } from "./nav-hotels";
import { NavMain } from "./nav-main";
import { NavPlaces } from "./nav-places";
import { NavUser } from "./nav-user";

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

export function AppSidebar() {
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
                <span className="text-base font-semibold">eTroupers</span>
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
        {/* <NavOthers /> */}
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <Suspense
          fallback={
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Skeleton className="h-8 w-8 rounded-lg grayscale" />
                  <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                    <Skeleton className="h-4 w-[120px] mb-1" />
                    <Skeleton className="h-3 w-[80px]" />
                  </div>
                  <Skeleton className="ml-auto size-4 rounded" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          }
        >
          <NavUser />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}
