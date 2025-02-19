import { prismaClientHttp } from "./db.server";

export function getRoutesByLocationId(locationId: string) {
  return prismaClientHttp.route.findMany({
    where: { locationId },
  });
}
