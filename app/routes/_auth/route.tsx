import type { Route } from "./+types/route";
import { Outlet, redirect, useMatches, type UIMatch } from "react-router";
import { getAuth } from "@clerk/react-router/ssr.server";
import { Breadcrumbs } from "react-aria-components";
import { Separator } from "react-aria-components";
import { AppSidebar } from "./components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "./components/sidebar";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export async function loader(args: Route.LoaderArgs) {
  const { userId } = await getAuth(args);

  // Protect the route by checking if the user is signed in
  if (!userId) {
    return redirect("/sign-in?redirect_url=" + args.request.url);
  }

  return null;
}

function isBreadcrumbHandle(handle: unknown): handle is { breadcrumb: string } {
  return (
    handle !== null &&
    typeof handle === "object" &&
    "breadcrumb" in handle &&
    typeof handle.breadcrumb === "string"
  );
}

export default function Route() {
  const matches = useMatches();

  const crumbs = matches
    .map((match) => {
      if (!isBreadcrumbHandle(match.handle)) {
        return null;
      }

      return {
        id: match.id,
        title: match.handle.breadcrumb,
        link: match.pathname,
      };
    })
    .filter(Boolean);

  return (
    <SidebarProvider>
      <AppSidebar />
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
