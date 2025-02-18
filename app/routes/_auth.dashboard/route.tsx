import { prismaClientHttp } from "@/db/db.server";
import type { Route } from "./+types/route";
import { getUserPublicMetadata } from "@/server/clerk";
import { redirect } from "react-router";

export async function loader(args: Route.LoaderArgs) {
  const publicMetadata = await getUserPublicMetadata(args);

  if (!publicMetadata.activeLocationId) {
    throw redirect("/switch-location");
  }

  const activeLocation = await prismaClientHttp.location.findUnique({
    where: { id: publicMetadata.activeLocationId },
  });

  if (!activeLocation) {
    throw redirect("/switch-location");
  }

  return {
    activeLocation,
  };
}

export default function Route({ loaderData }: Route.ComponentProps) {
  console.log("🚀 ~ Route ~ loaderData:", loaderData);

  return <div>dashboard</div>;
}
