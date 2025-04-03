import { prismaClientHttp } from "@/db/db.server";
import type { Route } from "./+types/route";
import { getUserPublicMetadata } from "@/server/clerk";
import {
  redirect,
  useFetcher,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "react-router";
import { Map as TldrawMap } from "@/components/tldraw-editor";
import "tldraw/tldraw.css";
import { type Prisma } from "@prisma/client";
import {
  DrawerLayout,
  DrawerProvider,
  useDrawerContext,
} from "@/components/drawer-layout";
import { Button } from "@/components/ui/button";
import {
  createRoute,
  deleteRoute,
  getActiveRoutesWithLogsByLocationId,
  updateRoute,
} from "@/db/routes.server";
import { z } from "zod";
import { createServerValidate } from "@/lib/createServerValidate";
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
import React, { memo } from "react";
import {
  AssetRecordType,
  createShapeId,
  DefaultKeyboardShortcutsDialog,
  DefaultKeyboardShortcutsDialogContent,
  DefaultToolbar,
  TldrawUiMenuItem,
  useIsToolSelected,
  useTools,
  useValue,
  type Editor,
  type TLComponents,
  type TLShapeId,
  type TLUiAssetUrlOverrides,
  type TLUiOverrides,
} from "tldraw";
import {
  isRouteShape,
  ROUTE_SHAPE,
  RouteShapeUtil,
} from "@/components/tldraw/shape-utils/route-shape-util";
import { getAuth } from "@clerk/react-router/ssr.server";
import { PolygonShapeUtil } from "@/components/tldraw/shape-utils/polygon-shape-util";
import { AdminRouteTool } from "@/components/tldraw/tools/admin-route-tool";
import { AdminHandTool } from "@/components/tldraw/tools/admin-hand-tool";
import { ColorRadioGroup } from "./-components/color-radio-group";
import { GradeSelect } from "./-components/grade-select";
import { SectorSelect } from "./-components/sector-select";
import { cn } from "@/lib/utils";
import { RouteBadge } from "@/components/route-badge";
import { animate } from "framer-motion";

const customShapesUtils = [PolygonShapeUtil, RouteShapeUtil];
const customTools = [AdminRouteTool, AdminHandTool];

const uiOverrides: TLUiOverrides = {
  tools(editor, tools) {
    tools["admin-hand-tool"] = {
      id: "admin-hand-tool",
      icon: "hand-icon",
      label: "Hand",
      kbd: "h",
      onSelect: () => {
        editor.setCurrentTool("admin-hand-tool");
      },
    };

    tools["admin-route-tool"] = {
      id: "admin-route-tool",
      icon: "route-add",
      label: "Route",
      kbd: "r",
      onSelect: () => {
        editor.setCurrentTool("admin-route-tool");
      },
    };

    return tools;
  },
};

const tldrawComponents: TLComponents = {
  Toolbar: (props) => {
    const prevTool = React.useRef("");
    const tools = useTools();

    const isHandToolSelected = useIsToolSelected(tools["admin-hand-tool"]);
    const isRouteToolSelected = useIsToolSelected(tools["admin-route-tool"]);
    const isSelectToolSelected = useIsToolSelected(tools["select"]);

    if (isHandToolSelected) {
      prevTool.current = "admin-hand-tool";
    }

    if (isRouteToolSelected) {
      prevTool.current = "admin-route-tool";
    }

    return (
      <DefaultToolbar {...props}>
        <TldrawUiMenuItem
          {...tools["admin-hand-tool"]}
          isSelected={
            isSelectToolSelected
              ? prevTool.current === "admin-hand-tool"
              : isHandToolSelected
          }
        />
        <TldrawUiMenuItem
          {...tools["admin-route-tool"]}
          isSelected={
            isSelectToolSelected
              ? prevTool.current === "admin-route-tool"
              : isRouteToolSelected
          }
        />
      </DefaultToolbar>
    );
  },

  KeyboardShortcutsDialog: (props) => {
    const tools = useTools();
    return (
      <DefaultKeyboardShortcutsDialog {...props}>
        <DefaultKeyboardShortcutsDialogContent />
        <TldrawUiMenuItem {...tools["admin-hand-tool"]} />
      </DefaultKeyboardShortcutsDialog>
    );
  },
};

const customAssetUrls: TLUiAssetUrlOverrides = {
  icons: {
    "hand-icon": "/assets/hand.svg",
    "route-add": "/assets/route-add.svg",
  },
};

export const handle = {
  breadcrumb: (loaderData) => `Edit ${loaderData.activeLocation.name} routes`,
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

const intentUpdateSchema = z.object({
  intent: z.literal("update").default("update"),
  id: z.string().min(1),
  grade: z.string().optional(),
  color: z.string().optional(),
  sector: z.string().optional(),
  x: z.coerce.number().optional(),
  y: z.coerce.number().optional(),
});

const intentDeleteSchema = z.object({
  intent: z.literal("delete").default("delete"),
  id: z.string().min(1),
});

const intentCreateSchema = z.object({
  intent: z.literal("create").default("create"),
  id: z.string().min(1),
  grade: z.string(),
  color: z.string(),
  sector: z.string().optional(),
  x: z.coerce.number(),
  y: z.coerce.number(),
});

const onUpdateValidate = createServerValidate({
  validators: {
    onSubmit: intentUpdateSchema,
  },
});

const onDeleteValidate = createServerValidate({
  validators: {
    onSubmit: intentDeleteSchema,
  },
});

const onCreateValidate = createServerValidate({
  validators: {
    onSubmit: intentCreateSchema,
  },
});

export async function action(args: Route.ActionArgs) {
  const requestUrl = new URL(args.request.url);
  const formData = await args.request.formData();

  const intent = formData.get("intent");

  if (intent === "delete") {
    const result = await onDeleteValidate(formData);

    if (!result.success) {
      return result.errors.formState;
    }

    const auth = await getAuth(args);

    if (!auth.orgId) {
      throw new Response("Unauthorized", { status: 401 });
    }

    await deleteRoute(result.data.id);

    return null;
    return redirect(args.request.url.split("?")[0]);
  }

  if (intent === "create") {
    const result = await onCreateValidate(formData);

    if (!result.success) {
      return result.errors.formState;
    }

    const auth = await getAuth(args);

    if (!auth.orgId) {
      throw new Response("Unauthorized", { status: 401 });
    }

    const { intent: _, ...resultData } = result.data;

    await createRoute({
      ...resultData,
      locationOrganizationId: auth.orgId,
      locationSlug: args.params.slug,
    });

    requestUrl.searchParams.set("routeId", resultData.id);
    return null;
    return redirect(requestUrl.toString());
  }

  const result = await onUpdateValidate(formData);

  if (!result.success) {
    return result.errors.formState;
  }

  const auth = await getAuth(args);

  if (!auth.orgId) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const { intent: _, ...resultData } = result.data;

  const route = await updateRoute(resultData);
  return null;
  return redirect(`${args.request.url.split("?")[0]}?routeId=${route.id}`);
}

export default function Route({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const [editor, setEditor] = React.useState<Editor | undefined>(undefined);

  return (
    <DrawerProvider>
      <div className="relative h-full">
        <Map setEditor={setEditor} />
      </div>
      {editor ? (
        <ExternalTldrawEditorProvider value={{ editor }}>
          <EditRouteDrawer actionData={actionData} />
        </ExternalTldrawEditorProvider>
      ) : null}
    </DrawerProvider>
  );
}

function Map({ setEditor }: { setEditor: (editor: Editor) => void }) {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const routeId = searchParams.get("routeId");
  const loaderData = useLoaderData<typeof loader>();

  const prevAdminTool = React.useRef<string | undefined>(undefined);
  const prevSelectTool = React.useRef<string | undefined>(undefined);
  const selectedRoute = React.useRef<TLShapeId | undefined>(undefined);

  const { open } = useDrawerContext();

  const isMapCreated = React.useRef(false);

  return (
    <TldrawMap
      initialState="admin-hand-tool"
      shapeUtils={customShapesUtils}
      tools={customTools}
      routes={loaderData.routes.map((r) => ({
        ...r,
        Log: [],
      }))}
      overrides={uiOverrides}
      components={tldrawComponents}
      assetUrls={customAssetUrls}
      onMount={(editor) => {
        if (routeId) {
          const shapeId = createShapeId(routeId);
          editor.setSelectedShapes([shapeId]);
        }

        editor.sideEffects.registerAfterCreateHandler("shape", (shape) => {
          if (!isRouteShape(shape)) {
            return;
          }

          const payload = {
            intent: "create",
            id: shape.props.id,
            x: shape.x.toString(),
            y: shape.y.toString(),
            grade: shape.props.grade,
            color: shape.props.color,
            locationId: loaderData.activeLocation.id,
          };

          if (shape.props.sector) {
            payload.sector = shape.props.sector;
          }

          submit(payload, {
            method: "POST",
            navigate: false,
          });

          editor.setSelectedShapes([shape.id]);

          open();
        });

        editor.sideEffects.registerAfterDeleteHandler("shape", (shape) => {
          if (isRouteShape(shape)) {
            submit(
              {
                intent: "delete",
                id: shape.props.id,
              },
              {
                method: "DELETE",
                navigate: false,
              }
            );
          }
        });

        editor.sideEffects.registerAfterChangeHandler(
          "instance_page_state",
          () => {
            const currentTool = editor.getCurrentTool()?.getPath();

            if (
              currentTool === "select.idle" &&
              prevSelectTool.current === "select.translating"
            ) {
              editor.setCurrentTool(prevAdminTool.current ?? "admin-hand-tool");
              const [selectedShape] = editor.getSelectedShapes();

              if (isRouteShape(selectedShape)) {
                submit(
                  {
                    intent: "update",
                    id: selectedShape.props.id,
                    x: selectedShape.x.toString(),
                    y: selectedShape.y.toString(),
                  },
                  {
                    method: "POST",
                    navigate: false,
                  }
                );
              }
            }

            if (!currentTool.includes("select")) {
              prevAdminTool.current = currentTool;
            } else {
              prevSelectTool.current = currentTool;
            }
          }
        );

        setEditor(editor);

        if (isMapCreated.current) {
          return;
        }
        const assetId = AssetRecordType.createId();
        const imageWidth = 770;
        const imageHeight = 1000;

        editor.createAssets([
          {
            id: assetId,
            type: "image",
            typeName: "asset",
            props: {
              name: "tldraw.png",
              src: `/assets/${loaderData.activeLocation.name.toLowerCase()}.svg`, // You could also use a base64 encoded string here
              w: imageWidth,
              h: imageHeight,
              mimeType: "image/svg+xml",
              isAnimated: false,
            },
            meta: {},
          },
        ]);

        editor.createShape({
          type: "image",
          x: (1000 - 770) / 2,
          y: 0,
          props: {
            assetId,
            w: imageWidth,
            h: imageHeight,
          },
        });

        const [mapShape] = editor.getCurrentPageShapes();

        editor.updateShape({
          id: mapShape.id,
          type: "image",
          isLocked: true,
        });

        editor.setCamera({ x: 0, y: 0, z: -10 });

        isMapCreated.current = true;
      }}
    />
  );
}

function EditRouteDrawer({ actionData }: DrawerContentProps) {
  return (
    <DrawerLayout preview={<DrawerPreview />}>
      <DrawerContent actionData={actionData} />
    </DrawerLayout>
  );
}

function EditRouteEmptyState() {
  return (
    <div className="grid">
      <p className="text-muted-foreground col-span-full row-span-full place-content-center text-center">
        Select a route to edit
      </p>
    </div>
  );
}

function DrawerPreview() {
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
        <EditRouteEmptyState />
      </div>
      <div
        className={cn("col-span-full row-span-full invisible", {
          visible: routeShape && isRouteShape(routeShape),
        })}
      >
        <div className="flex gap-2 justify-center">
          <RouteBadge
            color={isRouteShape(routeShape) ? routeShape.props.color : ""}
            className="size-8 text-xs"
          >
            {isRouteShape(routeShape) ? routeShape.props.grade : ""}
          </RouteBadge>
        </div>
      </div>
    </div>
  );
}

type DrawerContentProps = {
  actionData: Route.ComponentProps["actionData"];
};

function DrawerContent({ actionData }: DrawerContentProps) {
  const { editor } = useExternalTldrawEditor();
  const selectedShapes = useValue(
    "selected shapes",
    () => editor.getSelectedShapes(),
    [editor]
  );

  const [routeShape] = selectedShapes;

  if (selectedShapes.length !== 1 || !isRouteShape(routeShape)) {
    return null;
  }

  return (
    <div className="px-4">
      <EditRouteForm
        key={routeShape.id}
        actionData={actionData}
        id={routeShape.props.id}
        grade={routeShape.props.grade}
        color={routeShape.props.color}
        sector={routeShape.props.sector}
      />
    </div>
  );
}

function EditRouteForm({
  actionData,
  id,
  grade,
  color,
  sector,
}: {
  actionData: Route.ComponentProps["actionData"];
  id: string;
  grade: string;
  color: string;
  sector: string | undefined;
}) {
  const { close: closeDrawer } = useDrawerContext();
  const fetcher = useFetcher();
  const submit = useSubmit();
  const { editor } = useExternalTldrawEditor();

  const loaderData = useLoaderData<typeof loader>();

  const form = useForm({
    defaultValues: {
      intent: "update",
      id,
      color: color,
      grade: grade,
      sector: sector ?? loaderData.routes.find((r) => r.sector)?.sector,
    },
    validators: {
      onSubmit: intentUpdateSchema,
    },
    transform: useTransform(
      (baseForm) => {
        if (!actionData?.errors) {
          return baseForm;
        }

        // @ts-expect-error
        return mergeForm(baseForm, actionData);
      },
      [actionData]
    ),
  });

  return (
    <>
      <fetcher.Form
        method="POST"
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          closeDrawer();
        }}
      >
        <form.Field
          name="intent"
          children={(field) => (
            <input type="hidden" name={field.name} value={field.state.value} />
          )}
        />
        <form.Field
          name="id"
          children={(field) => (
            <input type="hidden" name={field.name} value={field.state.value} />
          )}
        />
        <form.Field
          name="color"
          children={(field) => (
            <ColorRadioGroup
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(value) => {
                field.handleChange(value);
                editor.updateShape({
                  id: createShapeId(id),
                  type: ROUTE_SHAPE,
                  props: {
                    color: value,
                  },
                });
              }}
              className="flex flex-wrap gap-2"
            />
          )}
        />
        <form.Field
          name="grade"
          children={(field) => (
            <GradeSelect
              label="Grade"
              name={field.name}
              selectedKey={field.state.value}
              onBlur={field.handleBlur}
              onSelectionChange={(value) => {
                field.handleChange(value.toString());
                editor.updateShape({
                  id: createShapeId(id),
                  type: ROUTE_SHAPE,
                  props: {
                    grade: value.toString(),
                  },
                });
              }}
            />
          )}
        />
        <form.Field
          name="sector"
          children={(field) => (
            <SectorSelect
              label="Sector"
              name={field.name}
              selectedKey={field.state.value}
              onBlur={field.handleBlur}
              onSelectionChange={(value) => {
                field.handleChange(value.toString());
                editor.updateShape({
                  id: createShapeId(id),
                  type: ROUTE_SHAPE,
                  props: {
                    sector: value.toString(),
                  },
                });
              }}
            />
          )}
        />
        <Button type="submit">Save</Button>
      </fetcher.Form>
      <Button
        className="w-full mt-4"
        type="submit"
        variant="destructive"
        name="intent"
        value="delete"
        onPress={() => {
          editor.deleteShape(createShapeId(id));

          submit(
            { intent: "delete", id },
            {
              method: "delete",
              navigate: false,
            }
          );

          closeDrawer();
        }}
      >
        Delete
      </Button>
    </>
  );
}

function isJsonObject(value: Prisma.JsonValue): value is Prisma.JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
