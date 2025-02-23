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
import { createShapeId, useValue, type Editor, type TLShapeId } from "tldraw";
import {
  isRouteShape,
  ROUTE_SHAPE,
  RouteShapeUtil,
} from "@/components/tldraw/shape-utils/route-shape-util";
import { getAuth } from "@clerk/react-router/ssr.server";
import { PolygonShapeUtil } from "@/components/tldraw/shape-utils/polygon-shape-util";
import { RouteTool } from "@/components/tldraw/tools/route-tool";
import { ColorRadioGroup } from "./-components/color-radio-group";
import { GradeSelect } from "./-components/grade-select";
import { SectorSelect } from "./-components/sector-select";

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
    grade: z.string().optional(),
    color: z.string().optional(),
    sector: z.string().optional(),
    x: z.coerce.number().optional(),
    y: z.coerce.number().optional(),
  }),
};

const serverValidate = createServerValidate({
  validators,
});

const onDeleteValidate = createServerValidate({
  validators: {
    onSubmit: z.object({
      id: z.string().min(1),
    }),
  },
});

export async function action(args: Route.ActionArgs) {
  const formData = await args.request.formData();

  console.log(
    "🚀 ~ action ~ args.request.method.toLowerCase():",
    args.request.method.toLowerCase()
  );
  if (args.request.method.toLowerCase() === "delete") {
    const result = await onDeleteValidate(formData);
    console.log("🚀 ~ action ~ result:", JSON.stringify(result, null, 2));

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
          routes={loaderData.routes.map((r) => ({
            ...r,
            Log: [],
          }))}
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
          <DrawerLayout preview={<DrawerPreview />}>
            {<DrawerContent actionData={actionData} />}
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

  if (selectedShapes.length !== 1 || !isRouteShape(routeShape)) {
    return <EditRouteEmptyState />;
  }

  return (
    <EditRouteForm
      actionData={actionData}
      id={routeShape.props.id}
      grade={routeShape.props.grade}
      color={routeShape.props.color}
      sector={routeShape.props.sector}
    />
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
  const fetcher = useFetcher();
  const { editor } = useExternalTldrawEditor();

  const form = useForm({
    defaultValues: {
      id,
      color: color,
      grade: grade,
      sector: sector,
    },
    validators: {
      onSubmit: validators.onSubmit,
    },
    transform: useTransform(
      (baseForm) => {
        if (!actionData?.errors) {
          return baseForm;
        }

        return mergeForm(baseForm, actionData);
      },
      [actionData]
    ),
  });

  const formErrors = useStore(form.store, (formState) => formState.errors);

  return (
    <>
      <fetcher.Form method="POST" className="flex flex-col gap-4">
        {formErrors.map((error) => (
          <p key={error as string}>{error}</p>
        ))}
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
        }}
      >
        <Button
          className="w-full mt-4"
          type="submit"
          variant="destructive"
          name="id"
          value={id}
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
