import { Outlet } from "react-router";

export const handle = {
  breadcrumb: "Locations",
};

export default function Route() {
  return <Outlet />;
}
