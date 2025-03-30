import type { Log } from "@prisma/client";
import { prismaClientWs } from "./db.server";

type LogKey = {
  userId: string;
  routeId: string;
};

export async function upsertLog(log: {
  status: Log["status"];
  userId: string;
  routeId: string;
}) {
  return prismaClientWs.log.upsert({
    where: { userId_routeId: { userId: log.userId, routeId: log.routeId } },
    update: log,
    create: log,
  });
}

export async function getLogById(logKey: LogKey) {
  return prismaClientWs.log.findUnique({
    where: { userId_routeId: logKey },
  });
}

export async function deleteLogById(logKey: LogKey) {
  return prismaClientWs.log.delete({
    where: { userId_routeId: logKey },
  });
}

export function getAllLogsByUserId(userId: string) {
  return prismaClientWs.log.findMany({
    where: {
      userId,
    },
    select: {
      createdAt: true,
      route: true,
      status: true,
    },
  });
}
