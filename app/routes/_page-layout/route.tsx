import { Outlet } from "react-router";

export default function Route() {
  return (
    <div className="px-4">
      <Outlet />
    </div>
  );
}
