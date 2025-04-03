import * as React from "react";

import { UserButton } from "@clerk/clerk-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./sidebar";
import { Link } from "@/components/ui/link";
import {
  ArrowRightLeftIcon,
  SquarePlusIcon,
  LayoutDashboardIcon,
  ChartSplineIcon,
} from "lucide-react";

export function AppSidebar({
  isAdmin,
  ...props
}: React.ComponentProps<typeof Sidebar> & { isAdmin: boolean }) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="bg-background rounded-tl-xl rounded-tr-xl">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/dashboard">
                <span className="text-2xl font-bold italic tracking-tight text-primary">
                  Beta Base
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <SidebarGroup>
          {isAdmin ? <SidebarGroupLabel>Personal</SidebarGroupLabel> : null}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/dashboard" className="flex gap-2">
                  <SquarePlusIcon />
                  <span>Log</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/statistics" className="flex gap-2">
                  <ChartSplineIcon />
                  <span>Statistics</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/switch-location" className="flex gap-2">
                  <ArrowRightLeftIcon />
                  <span>Switch location</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        {isAdmin ? (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin" className="flex gap-2">
                    <LayoutDashboardIcon />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/switch-organisation" className="flex gap-2">
                    <ArrowRightLeftIcon />
                    <span>Switch organisation</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        ) : null}
      </SidebarContent>
      <SidebarFooter className="bg-background rounded-bl-xl rounded-br-xl">
        <SidebarMenu>
          <SidebarMenuItem>
            <UserButton
              showName
              appearance={{
                elements: {
                  userButtonBox: "",
                  userButtonTrigger:
                    "p-2 w-full justify-between focus:shadow-none",
                  userButtonOuterIdentifier: "!text-foreground",
                },
              }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
