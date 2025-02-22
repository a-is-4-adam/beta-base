import type { Route } from "./+types/route";
import { getLocationBySlug } from "@/db/locations.server";
import { Outlet } from "react-router";

export const handle = {
  breadcrumb: (data: { location: { name: string } }) => {
    return data.location.name;
  },
};

export async function loader(args: Route.LoaderArgs) {
  return {
    location: await getLocationBySlug(args),
  };
}

export default function Route() {
  return <Outlet />;
}
