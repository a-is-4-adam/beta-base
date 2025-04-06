import type { Prisma, Route } from "@prisma/client";
import { prismaClientHttp } from "./db.server";

export function getActiveRoutesWithLogsByLocationId(
  id: string,
  userId: string
) {
  return prismaClientHttp.route.findMany({
    where: {
      location: {
        id,
      },
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Log: {
        where: {
          userId,
        },
      },
    },
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

export function deleteRoute(id: string) {
  return prismaClientHttp.route.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export function createRoute(data: {
  id: Route["id"];
  grade: Route["grade"];
  color: Route["color"];
  sector?: Route["sector"];
  x: Route["x"];
  y: Route["y"];
  locationSlug: Route["locationSlug"];
  locationOrganizationId: Route["locationOrganizationId"];
}) {
  return prismaClientHttp.route.upsert({
    where: { id: data.id },
    update: { sector: null, ...data },
    create: { sector: null, ...data },
  });
}
