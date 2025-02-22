import type { Route } from "./+types/route";
import { Outlet, redirect, useMatches, type UIMatch } from "react-router";
import { getAuth } from "@clerk/react-router/ssr.server";
import { Separator } from "react-aria-components";
import { AppSidebar } from "./components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "./components/sidebar";
import {
  Breadcrumbs,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getUserId, getUserOrganisationList } from "@/server/clerk";

export async function loader(args: Route.LoaderArgs) {
  const orgs = await getUserOrganisationList(args);

  return {
    isAdmin: orgs.totalCount > 0,
  };
}

function isBreadcrumbHandle(
  handle: unknown
): handle is { breadcrumb: string | ((data: unknown) => string) } {
  return (
    handle !== null && typeof handle === "object" && "breadcrumb" in handle
  );
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const matches = useMatches();

  const crumbs = matches
    .map((match) => {
      if (!isBreadcrumbHandle(match.handle)) {
        return null;
      }

      return {
        id: match.id,
        title:
          typeof match.handle.breadcrumb === "function"
            ? match.handle.breadcrumb(match.data)
            : match.handle.breadcrumb,
        link: match.pathname,
      };
    })
    .filter(Boolean);

  return (
    <SidebarProvider>
      <AppSidebar isAdmin={loaderData.isAdmin} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 h-4 border-l border-border"
            />

            <Breadcrumbs items={crumbs}>
              {(item) => (
                <BreadcrumbItem key={item.id}>
                  {({ isCurrent }) => (
                    <>
                      <BreadcrumbLink href={item.link}>
                        {item.title}
                      </BreadcrumbLink>
                      {isCurrent ? null : <BreadcrumbSeparator />}
                    </>
                  )}
                </BreadcrumbItem>
              )}
            </Breadcrumbs>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
