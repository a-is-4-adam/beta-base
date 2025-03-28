import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

const routes = [
  index("routes/_index/route.tsx"),

  layout("routes/_auth/route.tsx", [
    layout("routes/_page-layout/route.tsx", [
      route("switch-location", "routes/_auth.switch-location/route.tsx"),
      route(
        "switch-organisation",
        "routes/_auth.switch-organisation/route.tsx"
      ),

      route("admin", "routes/_auth.admin/route.tsx", [
        index("routes/_auth.admin.index/route.tsx"),
        route("locations", "routes/_auth.admin.locations/route.tsx", [
          index("routes/_auth.admin.locations.index/route.tsx"),
          route(":slug", "routes/_auth.admin.locations.$slug/route.tsx", [
            index("routes/_auth.admin.locations.$slug.index/route.tsx"),
          ]),
        ]),
      ]),
    ]),
    route("dashboard", "routes/_auth.dashboard/route.tsx"),
    route(
      "admin/locations/:slug/routes/edit",
      "routes/_auth.admin.locations.$slug.routes.edit/route.tsx"
    ),
  ]),

  layout("routes/_pre-auth/route.tsx", [
    route("sign-in/*", "routes/_pre-auth.sign-in/route.tsx"),
    route("sign-up/*", "routes/_pre-auth.sign-up/route.tsx"),
  ]),
] satisfies RouteConfig;

if (import.meta.env.DEV) {
  routes.push(route("log", "routes/log/route.tsx"));
}

export default routes;
