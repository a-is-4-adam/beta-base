import { prismaClientHttp } from "./db.server";

export function getActiveRoutesWithLogsByLocationId(locationId: string) {
  return prismaClientHttp.route.findMany({
    where: { locationId, deletedAt: null },
    include: { Log: true },
  });
}
