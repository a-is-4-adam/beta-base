import { prismaClientHttp } from "@/db/db.server";
import type { Route } from "./+types/route";
import { getUserPublicMetadata } from "@/server/clerk";
import {
  redirect,
  useFetcher,
  useLocation,
  useSearchParams,
  useSubmit,
} from "react-router";
import { Map } from "@/components/tldraw-editor";
import "tldraw/tldraw.css";
import { type Prisma } from "@prisma/client";
import { DrawerLayout } from "@/components/drawer-layout";
import { Button } from "@/components/ui/button";
import {
  getActiveRoutesWithLogsByLocationId,
  updateRoute,
} from "@/db/routes.server";
import { z } from "zod";
import { createServerValidate } from "@/lib/createServerValidate";
import { Input } from "@/components/ui/textfield";
import { CheckIcon, ZapIcon } from "lucide-react";
import {
  mergeForm,
  useForm,
  useStore,
  useTransform,
} from "@tanstack/react-form";
import {
  ExternalTldrawEditorProvider,
  useExternalTldrawEditor,
} from "@/components/external-tldraw-editor-context";
import React from "react";
import { createShapeId, useValue, type Editor, type TLShapeId } from "tldraw";
import {
  isRouteShape,
  ROUTE_SHAPE,
  RouteShapeUtil,
} from "@/components/tldraw/shape-utils/route-shape-util";
import { getAuth } from "@clerk/react-router/ssr.server";
import { PolygonShapeUtil } from "@/components/tldraw/shape-utils/polygon-shape-util";
import { RouteTool } from "@/components/tldraw/tools/route-tool";

const customShapesUtils = [PolygonShapeUtil, RouteShapeUtil];
const customTools = [RouteTool];

export const handle = {
  breadcrumb: "Edit routes",
};

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

  const routes = await getActiveRoutesWithLogsByLocationId(activeLocation.id);

  return {
    activeLocation,
    routes,
  };
}

const validators = {
  onSubmit: z.object({
    id: z.string().min(1),
    grade: z.string().min(1).optional(),
    color: z.string().min(1).optional(),
    sector: z.string().min(1).optional(),
    x: z.coerce.number().optional(),
    y: z.coerce.number().optional(),
  }),
};

const serverValidate = createServerValidate({
  validators,
});

export async function action(args: Route.ActionArgs) {
  const formData = await args.request.formData();
  const result = await serverValidate(formData);

  if (!result.success) {
    return result.errors.formState;
  }

  const auth = await getAuth(args);

  if (!auth.orgId) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const route = await updateRoute(result.data);

  return redirect(`${args.request.url}?routeId=${route.id}`);
}

export default function Route({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const routeId = searchParams.get("routeId");
  const [editor, setEditor] = React.useState<Editor | undefined>(undefined);

  const map = isJsonObject(loaderData.activeLocation.map)
    ? loaderData.activeLocation.map
    : undefined;

  const prevTool = React.useRef<string | undefined>(undefined);
  const selectedRoute = React.useRef<TLShapeId | undefined>(undefined);

  return (
    <>
      <div className="relative h-full -mx-4 w-[calc(100%+var(--spacing)*8)]">
        <Map
          initialState="route-tool"
          shapeUtils={customShapesUtils}
          tools={customTools}
          map={map}
          routes={loaderData.routes}
          onMount={(editor) => {
            if (routeId) {
              const shapeId = createShapeId(routeId);
              editor.setSelectedShapes([shapeId]);
            }

            editor.sideEffects.registerAfterChangeHandler(
              "instance_page_state",
              () => {
                if (
                  editor.isIn("select.translating") &&
                  !selectedRoute.current
                ) {
                  const selectedShape = editor.getSelectedShapes()[0];
                  if (isRouteShape(selectedShape)) {
                    selectedRoute.current = selectedShape.id;
                  }
                }

                const isPrevTranslating =
                  prevTool.current === "select.translating";

                if (isPrevTranslating && editor.isIn("select.idle")) {
                  editor.setSelectedShapes([]);
                  editor.setCurrentTool("route-tool");

                  if (selectedRoute.current) {
                    const shape = editor.getShape(selectedRoute.current);
                    if (isRouteShape(shape)) {
                      const formData = new FormData();
                      formData.append("id", shape.props.id);
                      formData.append("x", shape.x.toString());
                      formData.append("y", shape.y.toString());

                      console.log("what has moved");
                      submit(formData, {
                        method: "POST",
                      });
                    }
                  }

                  selectedRoute.current = undefined;
                }

                if (
                  prevTool.current === "route-tool.idle" &&
                  editor.isIn("select.idle")
                ) {
                  editor.setCurrentTool("route-tool");
                }

                prevTool.current = editor.getCurrentTool()?.getPath();
              }
            );

            setEditor(editor);
          }}
        />
      </div>
      {editor ? (
        <ExternalTldrawEditorProvider value={{ editor }}>
          <DrawerLayout preview={<div>preview</div>}>{null}</DrawerLayout>
        </ExternalTldrawEditorProvider>
      ) : null}
    </>
  );
}

function isJsonObject(value: Prisma.JsonValue): value is Prisma.JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
