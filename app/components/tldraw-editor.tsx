import {
  defaultShapeUtils,
  Tldraw,
  createTLStore,
  type TLComponents,
  type TLShape,
  type TLGeoShape,
} from "tldraw";
import { PolygonShapeUtil } from "./tldraw/shape-utils/polygon-shape-util";
import React from "react";
import { TldrawShapeIndicators } from "@/components/tldraw/shape-indicators";
import { MemberTool } from "@/components/tldraw/tools/member-tool";

const customShapesUtils = [PolygonShapeUtil];
const customTools = [MemberTool];

type TldrawEditorProps = {
  map: Record<string, unknown> | undefined;
} & Partial<Pick<React.ComponentPropsWithoutRef<typeof Tldraw>, "onMount">>;

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

export function Map({ map, onMount }: TldrawEditorProps) {
  const store = React.useMemo(
    () =>
      createTLStore({
        shapeUtils: [...defaultShapeUtils, ...customShapesUtils],
        snapshot: map,
      }),
    []
  );

  return (
    <div className="absolute inset-0 [&_*.tl-background]:bg-white border-x border-zinc-950/5 ">
      <Tldraw
        initialState="member-tool"
        shapeUtils={customShapesUtils}
        tools={customTools}
        components={components}
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

          onMount?.(editor);
        }}
      />
    </div>
  );
}

function isGeoShape(shape: TLShape): shape is TLGeoShape {
  return shape.type === "geo";
}
