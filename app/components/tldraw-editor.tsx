import {
  defaultShapeUtils,
  Tldraw,
  createTLStore,
  type TLComponents,
  type TLShape,
  type TLGeoShape,
  createShapeId,
} from "tldraw";
import React from "react";
import { TldrawShapeIndicators } from "@/components/tldraw/shape-indicators";
import { ROUTE_SHAPE } from "./tldraw/shape-utils/route-shape-util";
import type { Log, Route } from "@prisma/client";

type TldrawEditorProps = {
  map: Record<string, unknown> | undefined;
  routes: Array<Route & { Log?: Log[] }>;
} & Partial<
  Pick<
    React.ComponentPropsWithoutRef<typeof Tldraw>,
    | "onMount"
    | "initialState"
    | "shapeUtils"
    | "tools"
    | "overrides"
    | "components"
    | "assetUrls"
  >
>;

const components: TLComponents = {
  Toolbar: null,
  MenuPanel: null,
  StylePanel: null,
  NavigationPanel: null,
  ZoomMenu: null,
  PageMenu: null,
  QuickActions: null,
  ActionsMenu: null,
  ShapeIndicators: TldrawShapeIndicators,
};

export function Map({
  map,
  routes,
  onMount,
  components: componentsProp = {},
  ...props
}: TldrawEditorProps) {
  const store = React.useMemo(() => {
    return createTLStore({
      shapeUtils: [...defaultShapeUtils, ...(props.shapeUtils ?? [])],
      snapshot: map,
    });
    // TODO change the map prop to be a string
  }, [JSON.stringify(map)]);

  return (
    <div className="absolute inset-0 [&_*.tl-background]:bg-white border-x border-zinc-950/5 ">
      <Tldraw
        components={{
          ...components,
          ...componentsProp,
        }}
        // hides toolbar_extras
        options={{
          actionShortcutsLocation: "menu",
        }}
        forceMobile
        store={store}
        onMount={(editor) => {
          const geoShape = editor.getCurrentPageShapes().find(isGeoShape);

          if (geoShape) {
            editor.setCameraOptions({
              isLocked: false,
              wheelBehavior: "pan",
              panSpeed: 1,
              zoomSpeed: 1,
              zoomSteps: [1, 2, 4],

              constraints: {
                initialZoom: "fit-max",
                baseZoom: "fit-max",
                bounds: {
                  x: 0,
                  y: 0,
                  w: Math.ceil(geoShape.props.w ?? 0),
                  h: Math.ceil(geoShape.props.h ?? 0),
                },
                behavior: "contain",
                padding: { x: 0, y: 0 },
                origin: { x: 0.5, y: 0.5 },
              },
            });
          }
          editor.createShapes(
            routes.map((route) => {
              const shapeId = createShapeId(route.id);

              return {
                id: shapeId,
                type: ROUTE_SHAPE,
                x: route.x,
                y: route.y,
                props: {
                  id: route.id,
                  grade: route.grade,
                  color: route.color,
                  sector: route.sector ?? undefined,
                  status: route.Log?.[0]?.status,
                },
              };
            })
          );

          onMount?.(editor);
        }}
        {...props}
      />
    </div>
  );
}

function isGeoShape(shape: TLShape): shape is TLGeoShape {
  return shape.type === "geo";
}
