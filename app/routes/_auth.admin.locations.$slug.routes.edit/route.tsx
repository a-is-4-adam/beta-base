import { prismaClientHttp } from "@/db/db.server";
import type { Route } from "./+types/route";
import { getUserPublicMetadata } from "@/server/clerk";
import { redirect, useFetcher, useSearchParams, useSubmit } from "react-router";
import { Map } from "@/components/tldraw-editor";
import "tldraw/tldraw.css";
import { type Prisma } from "@prisma/client";
import { DrawerLayout } from "@/components/drawer-layout";
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
import React from "react";
import {
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
    const tools = useTools();
    const isHandToolSelected = useIsToolSelected(tools["admin-hand-tool"]);
    const isRouteToolSelected = useIsToolSelected(tools["admin-route-tool"]);
    return (
      <DefaultToolbar {...props}>
        <TldrawUiMenuItem
          {...tools["admin-hand-tool"]}
          isSelected={isHandToolSelected}
        />
        <TldrawUiMenuItem
          {...tools["admin-route-tool"]}
          isSelected={isRouteToolSelected}
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

  return redirect(`${args.request.url}?routeId=${route.id}`);
}

export default function Route({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  console.log("🚀 ~ isDrawerOpen:", isDrawerOpen);

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
          initialState="admin-hand-tool"
          shapeUtils={customShapesUtils}
          tools={customTools}
          map={map}
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

              const formData = new FormData();
              formData.append("intent", "create");
              formData.append("id", shape.props.id);
              formData.append("x", shape.x.toString());
              formData.append("y", shape.y.toString());
              formData.append("grade", shape.props.grade);
              formData.append("color", shape.props.color);
              formData.append("locationId", loaderData.activeLocation.id);
              if (shape.props.sector) {
                formData.append("sector", shape.props.sector);
              }

              submit(formData, {
                method: "POST",
              });

              editor.setSelectedShapes([shape.id]);
              setIsDrawerOpen(true);
            });

            editor.sideEffects.registerAfterDeleteHandler("shape", (shape) => {
              if (isRouteShape(shape)) {
                const formData = new FormData();
                formData.append("intent", "delete");
                formData.append("id", shape.props.id);

                submit(formData, {
                  method: "DELETE",
                });
              }
            });

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
                  editor.setCurrentTool("admin-route-tool");

                  if (selectedRoute.current) {
                    const shape = editor.getShape(selectedRoute.current);
                    if (isRouteShape(shape)) {
                      const formData = new FormData();
                      formData.append("intent", "update");
                      formData.append("id", shape.props.id);
                      formData.append("x", shape.x.toString());
                      formData.append("y", shape.y.toString());

                      submit(formData, {
                        method: "POST",
                      });
                    }
                  }

                  selectedRoute.current = undefined;
                }

                if (
                  prevTool.current === "admin-route-tool.idle" &&
                  editor.isIn("select.idle")
                ) {
                  editor.setCurrentTool("admin-route-tool");
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
          <DrawerLayout
            preview={<DrawerPreview />}
            isOpen={isDrawerOpen}
            setIsOpen={setIsDrawerOpen}
          >
            {
              <DrawerContent
                actionData={actionData}
                loaderData={loaderData}
                setIsDrawerOpen={setIsDrawerOpen}
              />
            }
          </DrawerLayout>
        </ExternalTldrawEditorProvider>
      ) : null}
    </>
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

  if (selectedShapes.length !== 1 || !isRouteShape(routeShape)) {
    return <EditRouteEmptyState />;
  }

  return (
    <div className="grid">
      <p className="text-muted-foreground col-span-full row-span-full place-content-center text-center">
        Swipe up to edit
      </p>
    </div>
  );
}

function DrawerContent({
  loaderData,
  actionData,
  setIsDrawerOpen,
}: {
  loaderData: Route.ComponentProps["loaderData"];
  actionData: Route.ComponentProps["actionData"];
  setIsDrawerOpen: (isOpen: boolean) => void;
}) {
  const { editor } = useExternalTldrawEditor();
  const selectedShapes = useValue(
    "selected shapes",
    () => editor.getSelectedShapes(),
    [editor]
  );

  const [routeShape] = selectedShapes;

  if (
    selectedShapes.length !== 1 ||
    !isRouteShape(routeShape)
    // !loaderData.routes.find((r) => r.id === routeShape.props.id)
  ) {
    return <EditRouteEmptyState />;
  }

  return (
    <EditRouteForm
      actionData={actionData}
      id={routeShape.props.id}
      grade={routeShape.props.grade}
      color={routeShape.props.color}
      sector={routeShape.props.sector}
      setIsDrawerOpen={setIsDrawerOpen}
    />
  );
}

function EditRouteForm({
  actionData,
  id,
  grade,
  color,
  sector,
  setIsDrawerOpen,
}: {
  actionData: Route.ComponentProps["actionData"];
  id: string;
  grade: string;
  color: string;
  sector: string | undefined;
  setIsDrawerOpen: (isOpen: boolean) => void;
}) {
  const fetcher = useFetcher();
  const { editor } = useExternalTldrawEditor();

  const form = useForm({
    defaultValues: {
      intent: "update",
      id,
      color: color,
      grade: grade,
      sector: sector,
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

  const formErrors = useStore(form.store, (formState) => formState.errors);

  return (
    <>
      <fetcher.Form method="POST" className="flex flex-col gap-4">
        {/* {formErrors.length ? JSON.stringify(formErrors) : null}
        {JSON.stringify(actionData)} */}

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
                    grade: value,
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
              }}
            />
          )}
        />
        <Button type="submit">Save</Button>
      </fetcher.Form>
      <fetcher.Form
        method="DELETE"
        onSubmit={(event) => {
          editor.deleteShape(createShapeId(id));
          fetcher.submit(event.currentTarget.form, {
            method: "DELETE",
          });
          setIsDrawerOpen(false);
        }}
      >
        <input type="hidden" name="id" value={id} />
        <Button
          id="foo"
          className="w-full mt-4"
          type="submit"
          variant="destructive"
          name="intent"
          value="delete"
        >
          Delete
        </Button>
      </fetcher.Form>
    </>
  );
}

function isJsonObject(value: Prisma.JsonValue): value is Prisma.JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
