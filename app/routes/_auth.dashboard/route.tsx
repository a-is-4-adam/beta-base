import { prismaClientHttp } from "@/db/db.server";
import type { Route } from "./+types/route";

export async function loader(args: Route.LoaderArgs) {
  const locations = await prismaClientHttp.location.findMany();
  return {
    locations,
  };
}

export default function Route({ loaderData }: Route.ComponentProps) {
  console.log("🚀 ~ Route ~ loaderData:", loaderData);

  return <div>dashboard</div>;
}
