import {
  createShapeId,
  StateNode,
  type TLPointerEventInfo,
  type TLStateNodeConstructor,
} from "tldraw";
import {
  DEFAULT_ROUTE_RADIUS,
  isRouteShape,
  ROUTE_SHAPE,
} from "../shape-utils/route-shape-util";
import { createId } from "@paralleldrive/cuid2";

export class AdminRouteTool extends StateNode {
  static override id = "admin-route-tool";
  static override initial = "idle";
  static override isLockable = false;
  static override children(): TLStateNodeConstructor[] {
    return [Idle, Pointing];
  }
}

class Idle extends StateNode {
  static override id = "idle";

  override onEnter() {
    this.editor.setCursor({ type: "cross", rotation: 0 });
  }

  override onPointerDown(info: TLPointerEventInfo) {
    const { currentPagePoint } = this.editor.inputs;

    const existingShape = this.editor
      .getShapesAtPoint(currentPagePoint, {
        margin: DEFAULT_ROUTE_RADIUS,
        hitInside: true,
      })
      .find(isRouteShape);

    if (existingShape && isRouteShape(existingShape)) {
      this.editor.setSelectedShapes([existingShape.id]);
    } else {
      this.editor.setSelectedShapes([]);
      this.editor.setHoveredShape(null);
    }

    this.parent.transition("pointing", info);
  }

  override onCancel() {
    this.editor.setCurrentTool("admin-route-tool");
  }
}

class Pointing extends StateNode {
  static override id = "pointing";

  override onEnter() {
    this.editor.setCursor({ type: "grabbing", rotation: 0 });
  }

  override onPointerUp(): void {
    const [selectedShape] = this.editor.getSelectedShapes();

    if (isRouteShape(selectedShape)) {
      this.editor.setSelectedShapes([selectedShape.id]);
      this.complete();
      return;
    }

    const id = createId();
    const { currentPagePoint } = this.editor.inputs;

    this.editor.createShape({
      type: ROUTE_SHAPE,
      id: createShapeId(id),
      x: currentPagePoint.x - DEFAULT_ROUTE_RADIUS,
      y: currentPagePoint.y - DEFAULT_ROUTE_RADIUS,

      props: {
        id,
      },
    });

    this.editor.setSelectedShapes([createShapeId(id)]);
    this.editor.setHoveredShape(createShapeId(id));

    this.complete();
  }

  override onPointerMove() {
    const [selectedShape] = this.editor.getSelectedShapes();

    if (isRouteShape(selectedShape) && this.editor.inputs.isDragging) {
      this.editor.setCurrentTool("select.translating");
      return;
    }
  }

  override onCancel() {
    this.complete();
  }

  override onComplete() {
    this.complete();
  }

  override onInterrupt() {
    this.complete();
  }

  private complete() {
    this.parent.transition("idle");
  }
}
