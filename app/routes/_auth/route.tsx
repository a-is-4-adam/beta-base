import type { Route } from "./+types/route";
import { Outlet, redirect } from "react-router";
import { getAuth } from "@clerk/react-router/ssr.server";

export async function loader(args: Route.LoaderArgs) {
  const { userId } = await getAuth(args);

  // Protect the route by checking if the user is signed in
  if (!userId) {
    return redirect("/sign-in?redirect_url=" + args.request.url);
  }

  return null;
}

export default function Route() {
  return <Outlet />;
}
