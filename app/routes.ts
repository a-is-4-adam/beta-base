import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/_index/route.tsx"),

  layout("routes/_auth/route.tsx", [
    route("dashboard", "routes/_auth.dashboard/route.tsx"),
    route("switch-location", "routes/_auth.switch-location/route.tsx"),
  ]),

  layout("routes/_pre-auth/route.tsx", [
    route("sign-in/*", "routes/_pre-auth.sign-in/route.tsx"),
    route("sign-up/*", "routes/_pre-auth.sign-up/route.tsx"),
  ]),
] satisfies RouteConfig;
