import { prismaClientHttp } from "./db.server";

export function getActiveRoutesWithLogsByLocationId(id: string) {
  return prismaClientHttp.route.findMany({
    where: {
      location: {
        id,
      },
      deletedAt: null,
    },
    include: { Log: true },
  });
}

export function getActiveRouteById(id: string) {
  return prismaClientHttp.route.findUnique({
    where: { id, deletedAt: null },
  });
}
