import "tldraw/tldraw.css";
import {
  type TLShapeId,
  useEditor,
  useEditorComponents,
  useValue,
} from "tldraw";

export function TldrawShapeIndicators() {
  const editor = useEditor();

  const indicatorsToShow = new Set<TLShapeId>();

  const selectedShapes = useValue(
    "selected shapes",
    () => {
      return editor.getSelectedShapes();
    },
    [editor]
  );

  const hoveredShape = useValue(
    "hovered shape",
    () => {
      return editor.getHoveredShape();
    },
    [editor]
  );

  selectedShapes.forEach((shape) => {
    if (shape.type !== "polygon-shape") {
      indicatorsToShow.add(shape.id);
    }
  });

  if (hoveredShape) {
    indicatorsToShow.add(hoveredShape.id);
  }

  const { ShapeIndicator } = useEditorComponents();

  if (indicatorsToShow.size === 0 || !ShapeIndicator) {
    return null;
  }

  return <ShapeIndicator shapeId={Array.from(indicatorsToShow)[0]} />;
}
