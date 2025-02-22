import { getAuth } from "@clerk/react-router/ssr.server";
import { prismaClientHttp } from "./db.server";
import { redirect } from "react-router";

export function getLocationsByOrganisationId({
  id,
}: {
  id: string | null | undefined;
}) {
  if (!id) {
    return [];
  }

  return prismaClientHttp.location.findMany({
    where: { organizationId: id },
  });
}

export async function getLocationBySlug(
  args: Parameters<typeof getAuth>[0] & {
    params: { slug: string };
  }
) {
  const { slug } = args.params;
  const { orgId } = await getAuth(args);

  if (!orgId) {
    throw redirect("/switch-organisation");
  }

  const locations = await prismaClientHttp.location.findMany({
    where: { slug, organizationId: orgId },
  });

  const location = locations[0];

  if (!location) {
    throw new Response("Not Found", { status: 404 });
  }

  return location;
}
