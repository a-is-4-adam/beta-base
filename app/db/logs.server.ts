import type { Log } from "@prisma/client";
import { prismaClientWs } from "./db.server";
import { createId } from "@paralleldrive/cuid2";

export function upsertLog(log: {
  id?: string;
  status: Log["status"];
  userId: string;
  routeId: string;
}) {
  const logId = log.id ?? createId();

  return prismaClientWs.log.upsert({
    where: { id: log.id ?? logId },
    update: log,
    create: {
      ...log,
      id: logId,
    },
  });
}
