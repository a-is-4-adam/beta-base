import type { Prisma, Route } from "@prisma/client";
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

export function updateRoute(data: {
  id: Route["id"];
  x?: Route["x"];
  y?: Route["y"];
  grade?: Route["grade"];
  color?: Route["color"];
  sector?: Route["sector"];
}) {
  return prismaClientHttp.route.update({
    where: { id: data.id, deletedAt: null },
    data,
  });
}
