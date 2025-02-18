import * as React from "react";

import { OrganizationSwitcher, UserButton } from "@clerk/clerk-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./sidebar";

import { Link } from "react-router";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <OrganizationSwitcher
                hidePersonal={true}
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    avatarBox: "bg-transparent",
                    organizationSwitcherTrigger: "p-2 w-full justify-between",
                    organizationPreviewMainIdentifier:
                      "font-semibold text-sidebar-foreground",
                  },
                }}
              />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/dashboard">
                  <span>Log</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/switch-location">
                  <span>Switch Location</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserButton
              showName
              appearance={{
                elements: {
                  userButtonBox: "",
                  userButtonTrigger:
                    "p-2 w-full justify-between focus:shadow-none",
                  userButtonOuterIdentifier: "text-sidebar-foreground",
                },
              }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
