import {
  defaultShapeUtils,
  Tldraw,
  createTLStore,
  type TLComponents,
  createShapeId,
  AssetRecordType,
} from "tldraw";
import React from "react";
import { TldrawShapeIndicators } from "@/components/tldraw/shape-indicators";
import { ROUTE_SHAPE } from "./tldraw/shape-utils/route-shape-util";
import type { Log, Route } from "@prisma/client";

type TldrawEditorProps = {
  routes: Array<Route & { Log?: Log[] }>;
  mapFileName: string;
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
  routes,
  onMount,
  components: componentsProp = {},
  mapFileName,
  ...props
}: TldrawEditorProps) {
  const store = React.useMemo(() => {
    return createTLStore({
      shapeUtils: [...defaultShapeUtils, ...(props.shapeUtils ?? [])],
      // snapshot: map,
    });
    // TODO change the map prop to be a string
  }, []);

  return (
    <div className="absolute inset-0 ">
      <Tldraw
        components={{
          ...components,
          ...componentsProp,
        }}
        // hides toolbar_extras
        options={{
          actionShortcutsLocation: "menu",
        }}
        store={store}
        onMount={(editor) => {
          editor.user.updateUserPreferences({ colorScheme: "dark" });

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
                w: Math.ceil(1000),
                h: Math.ceil(1000),
              },
              behavior: "contain",
              padding: { x: 20, y: 20 },
              origin: { x: 0.5, y: 0.5 },
            },
          });

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
                src: `/assets/${mapFileName}.svg`, // You could also use a base64 encoded string here
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
            // Let's center the image in the editor
            // x: (window.innerWidth - imageWidth) / 2,
            // y: (window.innerHeight - imageHeight) / 2,
            x: (1000 - 770) / 2,
            y: 0,
            props: {
              assetId,
              w: imageWidth,
              h: imageHeight,
            },
          });

          const [mapShape] = editor.getCurrentPageShapes();
          editor.sendToBack([mapShape.id]);

          editor.updateShape({
            id: mapShape.id,
            type: "image",
            isLocked: true,
          });

          editor.setCamera({ x: 0, y: 0, z: -10 });

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
