import { prismaClientHttp } from "@/db/db.server";
import type { Route } from "./+types/route";
import { getUserPublicMetadata } from "@/server/clerk";
import { redirect } from "react-router";
import { Map } from "@/components/tldraw-editor";
import "tldraw/tldraw.css";
import type { Prisma } from "@prisma/client";
import { DrawerLayout } from "@/components/drawer-layout";
import { Button } from "@/components/ui/button";

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
  const map = isJsonObject(loaderData.activeLocation.map)
    ? loaderData.activeLocation.map
    : undefined;

  return (
    <>
      <div className="relative h-full -mx-4 w-[calc(100%+var(--spacing)*8)]">
        <Map map={map} />
      </div>
      <DrawerLayout preview={<DrawerPreview />}>
        <DrawerPreview />
      </DrawerLayout>
    </>
  );
}

function DrawerPreview() {
  return (
    <div className="flex gap-2">
      <Button variant="outline" className="w-full">
        Send
      </Button>
      <Button variant="outline" className="w-full">
        Flash
      </Button>
    </div>
  );
}

function isJsonObject(value: Prisma.JsonValue): value is Prisma.JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
