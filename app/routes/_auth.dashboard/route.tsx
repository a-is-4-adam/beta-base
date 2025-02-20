import { prismaClientHttp } from "@/db/db.server";
import type { Route } from "./+types/route";
import { getUserId, getUserPublicMetadata } from "@/server/clerk";
import { redirect, useFetcher, useSearchParams } from "react-router";
import { Map } from "@/components/tldraw-editor";
import "tldraw/tldraw.css";
import { type Prisma } from "@prisma/client";
import { DrawerLayout } from "@/components/drawer-layout";
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
  type RouteShape,
} from "@/components/tldraw/shape-utils/route-shape-util";

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
    id: z.string().min(1).optional(),
    routeId: z.string().min(1),
    status: z.enum(["SEND", "FLASH"]).optional(),
  }),
  onSubmit: z
    .object({
      id: z.string().optional(),
      routeId: z.string().min(1),
      status: z.enum(["SEND", "FLASH"]),
    })
    .refine(({ id, ...rest }) => {
      if (typeof id === "string" && id.length === 0) {
        return rest;
      }

      return {
        ...rest,
        id,
      };
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

  const route = await getActiveRouteById(result.data.routeId);

  if (!route) {
    return buildServerError("Route not found", result.data).errors.formState;
  }
  const userId = await getUserId(args);

  if (result.data.id) {
    const log = await getLogById(result.data.id);

    if (log && log.status === result.data.status) {
      await deleteLogById(log.id);
      return redirect(`/dashboard?routeId=${result.data.routeId}`);
    }
  }

  await upsertLog({
    id: result.data.id,
    routeId: result.data.routeId,
    status: result.data.status,
    userId,
  });

  return redirect(`/dashboard?routeId=${result.data.routeId}`);
}

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
    <>
      <div className="relative h-full -mx-4 w-[calc(100%+var(--spacing)*8)]">
        <Map
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
          <DrawerLayout preview={<DrawerPreview actionData={actionData} />}>
            <DrawerPreview actionData={actionData} />
          </DrawerLayout>
        </ExternalTldrawEditorProvider>
      ) : null}
    </>
  );
}

function EditLogEmptyState() {
  return (
    <div className="grid">
      <p className="text-muted-foreground col-span-full row-span-full place-content-center text-center">
        Select a route to log
      </p>
      <Button
        aria-hidden
        size="lg"
        className="invisible col-span-full row-span-full"
      />
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

  if (selectedShapes.length !== 1) {
    return <EditLogEmptyState />;
  }

  const [routeShape] = selectedShapes;

  if (routeShape && !isRouteShape(routeShape)) {
    return <EditLogEmptyState />;
  }

  return <UpsertLogForm actionData={actionData} shape={routeShape} />;
}

function UpsertLogForm({
  actionData,
  shape,
}: {
  actionData: Route.ComponentProps["actionData"];
  shape: RouteShape;
}) {
  const { editor } = useExternalTldrawEditor();
  const fetcher = useFetcher();

  const fetcherStatus = fetcher.formData?.get("status");
  const isUpdating = fetcher.formData?.get("id");
  const isDeleting = isUpdating && fetcherStatus !== shape.props.status;
  const status = isDeleting ? undefined : fetcherStatus ?? shape.props.status;

  // TODO I think this form should be split up per button  Should make the above easier
  // and could use different methods for each button
  const form = useForm({
    defaultValues: {
      id: shape.props.id,
      routeId: shape.props.id,
      status: shape.props.status,
    },
    validators,
    // @ts-expect-error TODO fix this
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, actionData ?? {}),
      [actionData]
    ),
  });

  const formErrors = useStore(form.store, (formState) => formState.errors);

  const handleChange = (value: { status: "SEND" | "FLASH" }) => {
    if (value.status === form.state.values.status) {
      editor.updateShape({
        id: createShapeId(shape.props.id),
        type: ROUTE_SHAPE,
        props: {
          status: undefined,
        },
      });
    } else {
      editor.updateShape({
        id: createShapeId(shape.props.id),
        type: ROUTE_SHAPE,
        props: {
          status: value.status,
        },
      });
    }
  };

  return (
    <fetcher.Form method="post" className="flex gap-2">
      {formErrors.map((error) => (
        <p key={error as string}>{error}</p>
      ))}
      <form.Field name="id">
        {(field) => (
          <Input type="hidden" name={field.name} value={field.state.value} />
        )}
      </form.Field>
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
            value="SEND"
            variant={status === "SEND" ? "default" : "outline"}
            onPress={() => {
              handleChange({ status: "SEND" });
            }}
            size="lg"
            className="w-full gap-2"
          >
            <CheckIcon /> Send
          </Button>
        )}
      </form.Field>
      <form.Field name="status">
        {(field) => (
          <Button
            type="submit"
            name={field.name}
            value="FLASH"
            variant={status === "FLASH" ? "default" : "outline"}
            onPress={() => {
              handleChange({ status: "FLASH" });
            }}
            size="lg"
            className="w-full gap-2"
          >
            <ZapIcon /> Flash
          </Button>
        )}
      </form.Field>
    </fetcher.Form>
  );
}

function isJsonObject(value: Prisma.JsonValue): value is Prisma.JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
