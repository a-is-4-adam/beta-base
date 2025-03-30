import { prismaClientHttp } from "@/db/db.server";
import type { Route } from "./+types/route";
import { getUserId, getUserPublicMetadata } from "@/server/clerk";
import { redirect, useFetcher, useSearchParams } from "react-router";
import { Map } from "@/components/tldraw-editor";
import "tldraw/tldraw.css";
import { type Prisma } from "@prisma/client";
import { DrawerLayout, DrawerProvider } from "@/components/drawer-layout";
import { Button } from "@/components/ui/button";
import {
  getActiveRoutesWithLogsByLocationId,
  getActiveRouteById,
} from "@/db/routes.server";
import { z } from "zod";
import {
  buildServerError,
  createServerValidate,
} from "@/lib/createServerValidate";
import { deleteLogById, getLogById, upsertLog } from "@/db/logs.server";
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
import { createShapeId, useValue, type Editor } from "tldraw";
import {
  isRouteShape,
  ROUTE_SHAPE,
  RouteShapeUtil,
} from "@/components/tldraw/shape-utils/route-shape-util";
import { PolygonShapeUtil } from "@/components/tldraw/shape-utils/polygon-shape-util";
import { MemberTool } from "@/components/tldraw/tools/member-tool";
import { cn } from "@/lib/utils";

const customShapesUtils = [PolygonShapeUtil, RouteShapeUtil];
const customTools = [MemberTool];

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
  onMount: z.object({
    routeId: z.string().min(1),
    status: z.enum(["SEND", "FLASH"]).optional(),
  }),
  onSubmit: z.object({
    routeId: z.string().min(1),
    status: z.enum(["SEND", "FLASH"]),
  }),
};

const serverValidate = createServerValidate({
  validators,
});

export async function action(args: Route.ActionArgs) {
  const [userId, formData] = await Promise.all([
    getUserId(args),
    args.request.formData(),
  ]);
  const result = await serverValidate(formData);

  if (!result.success) {
    return result.errors.formState;
  }

  const [route, log] = await Promise.all([
    getActiveRouteById(result.data.routeId),
    getLogById({
      userId,
      routeId: result.data.routeId,
    }),
  ]);

  if (!route) {
    return buildServerError("Route not found", result.data).errors.formState;
  }

  const isDeleting = args.request.method.toLowerCase() === "delete";

  if (isDeleting) {
    if (log) {
      await deleteLogById({
        userId,
        routeId: result.data.routeId,
      });
    }
  } else {
    await upsertLog({
      userId,
      routeId: result.data.routeId,
      status: result.data.status,
    });
  }
  return redirect(`/dashboard?routeId=${result.data.routeId}`);
}

export const handle = {
  breadcrumb: (loaderData) => loaderData.activeLocation.name,
};

export default function Route({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const routeId = searchParams.get("routeId");
  const [editor, setEditor] = React.useState<Editor | undefined>(undefined);

  const map = isJsonObject(loaderData.activeLocation.map)
    ? loaderData.activeLocation.map
    : undefined;

  return (
    <DrawerProvider>
      <div className="relative h-full">
        <Map
          initialState="member-tool"
          shapeUtils={customShapesUtils}
          tools={customTools}
          map={map}
          routes={loaderData.routes}
          onMount={(editor) => {
            if (routeId) {
              const shapeId = createShapeId(routeId);
              editor.setSelectedShapes([shapeId]);
            }
            setEditor(editor);
          }}
        />
      </div>
      {editor ? (
        <ExternalTldrawEditorProvider value={{ editor }}>
          <DrawerLayout preview={<DrawerPreview actionData={actionData} />} />
        </ExternalTldrawEditorProvider>
      ) : null}
    </DrawerProvider>
  );
}

function EditLogEmptyState() {
  return (
    <div className="grid">
      <p className="text-muted-foreground col-span-full row-span-full place-content-center text-center">
        Select a route to log
      </p>
    </div>
  );
}

function DrawerPreview({
  actionData,
}: {
  actionData: Route.ComponentProps["actionData"];
}) {
  const { editor } = useExternalTldrawEditor();
  const selectedShapes = useValue(
    "selected shapes",
    () => editor.getSelectedShapes(),
    [editor]
  );

  const [routeShape] = selectedShapes;

  return (
    <div className="grid grid-cols-1 grid-rows-1 p-2">
      <div
        className={cn(
          "col-span-full row-span-full flex items-center justify-center visible",
          {
            invisible: routeShape && isRouteShape(routeShape),
          }
        )}
      >
        <EditLogEmptyState />
      </div>
      <div
        className={cn("col-span-full row-span-full invisible", {
          visible: routeShape && isRouteShape(routeShape),
        })}
      >
        <div className="flex gap-2">
          <UpsertLogForm
            actionData={actionData}
            routeId={
              routeShape && isRouteShape(routeShape) ? routeShape.props.id : ""
            }
            status="SEND"
            routeStatus={
              routeShape && isRouteShape(routeShape)
                ? routeShape.props.status
                : undefined
            }
          >
            <CheckIcon /> Send
          </UpsertLogForm>
          <UpsertLogForm
            actionData={actionData}
            routeId={
              routeShape && isRouteShape(routeShape) ? routeShape.props.id : ""
            }
            status="FLASH"
            routeStatus={
              routeShape && isRouteShape(routeShape)
                ? routeShape.props.status
                : undefined
            }
          >
            <ZapIcon /> Flash
          </UpsertLogForm>
        </div>
      </div>
    </div>
  );
}

function UpsertLogForm({
  actionData,
  routeId,
  status,
  routeStatus,
  children,
}: {
  actionData: Route.ComponentProps["actionData"];
  routeId: string;
  status: "SEND" | "FLASH";
  routeStatus: "SEND" | "FLASH" | undefined;
  children: React.ReactNode;
}) {
  console.log("🚀 ~ routeId:", routeId);
  const { editor } = useExternalTldrawEditor();
  const fetcher = useFetcher();

  const isActiveStatus = routeStatus === status;

  const form = useForm({
    defaultValues: {
      routeId,
      status,
    },
    validators: routeId ? validators : {},
    // @ts-expect-error TODO fix this
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, actionData ?? {}),
      [actionData]
    ),
    onSubmit: ({ value }) => {
      fetcher.submit(
        {
          routeId,
          status,
        },
        {
          method: isActiveStatus ? "DELETE" : "POST",
        }
      );

      if (isActiveStatus) {
        editor.updateShape({
          id: createShapeId(routeId),
          type: ROUTE_SHAPE,
          props: {
            status: undefined,
          },
        });
      } else {
        editor.updateShape({
          id: createShapeId(routeId),
          type: ROUTE_SHAPE,
          props: {
            status,
          },
        });
      }
    },
  });

  const formErrors = useStore(form.store, (formState) => formState.errors);

  return (
    <fetcher.Form
      method={"post"}
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      {formErrors.map((error) => (
        <p key={error as string}>{error}</p>
      ))}
      <form.Field name="routeId">
        {(field) => (
          <Input type="hidden" name={field.name} value={field.state.value} />
        )}
      </form.Field>
      <form.Field name="status">
        {(field) => (
          <Button
            type="submit"
            name={field.name}
            value={field.state.value}
            variant={isActiveStatus ? "default" : "outline"}
            size="lg"
            className="w-full gap-2"
          >
            {children}
          </Button>
        )}
      </form.Field>
    </fetcher.Form>
  );
}

function isJsonObject(value: Prisma.JsonValue): value is Prisma.JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
