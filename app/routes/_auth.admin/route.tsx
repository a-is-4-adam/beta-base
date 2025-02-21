import { getAuth } from "@clerk/react-router/ssr.server";
import type { Route } from "./+types/route";
import { getUserOrganisationList } from "@/server/clerk";
import { redirect } from "react-router";

export async function loader(args: Route.LoaderArgs) {
  const [auth, orgs] = await Promise.all([
    getAuth(args),
    getUserOrganisationList(args),
  ]);

  if (!auth.orgId && orgs.totalCount === 0) {
    return redirect("/dashboard");
  }

  if (!auth.orgId) {
    return redirect("/switch-organisation");
  }

  return {
    orgs,
  };
}
export default function Route() {
  return <div>Admin layout</div>;
}
