"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@dropin/ui/components/sidebar";
import {
  IconChartPie,
  IconCloudFilled,
  IconFolders,
  IconFrame,
  IconHome,
  IconMap,
  IconSettings,
  IconStar,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: IconHome,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "My Files",
      url: "#",
      icon: IconFolders,
      items: [],
    },
    {
      title: "Starred",
      url: "#",
      icon: IconStar,
      items: [],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
      items: [],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: IconFrame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: IconChartPie,
    },
    {
      name: "Travel",
      url: "#",
      icon: IconMap,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to="/" />}>
              <div className="flex aspect-square size-7 items-center justify-center rounded-sm bg-sidebar-primary text-sidebar-primary-foreground">
                <IconCloudFilled className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-lg font-medium">Dropin</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
