import { defaultShapeUtils, Tldraw, createTLStore } from "tldraw";
import { PolygonShapeUtil } from "./tldraw/shape-utils/polygon-shape-util";
import React from "react";

const customShapes = [PolygonShapeUtil];

type TldrawEditorProps = {
  map: Record<string, unknown> | undefined;
} & Partial<Pick<React.ComponentPropsWithoutRef<typeof Tldraw>, "onMount">>;

export function Map({ map, onMount }: TldrawEditorProps) {
  const store = React.useMemo(
    () =>
      createTLStore({
        shapeUtils: [...defaultShapeUtils, ...customShapes],
        snapshot: map,
      }),
    []
  );

  return (
    <div className="absolute inset-0 [&_*.tl-background]:bg-white border-x border-zinc-950/5 ">
      <Tldraw
        // initialState="member-tool"
        shapeUtils={customShapes}
        forceMobile
        store={store}
        onMount={(editor) => {
          onMount?.(editor);
        }}
      />
    </div>
  );
}
