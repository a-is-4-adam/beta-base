import { StateNode, type TLStateNodeConstructor, Vec } from "tldraw";
import {
  DEFAULT_ROUTE_RADIUS,
  isRouteShape,
} from "../shape-utils/route-shape-util";
import { Dragging } from "./state-nodes/dragging";

class Idle extends StateNode {
  static override id = "idle";

  override onEnter() {
    this.editor.setCursor({ type: "grab", rotation: 0 });
  }

  override onPointerDown(): void {
    const { currentPagePoint } = this.editor.inputs;

    const existingShape = this.editor.getShapeAtPoint(currentPagePoint, {
      margin: DEFAULT_ROUTE_RADIUS,
      hitFrameInside: true,
      hitInside: true,
    });

    if (existingShape && isRouteShape(existingShape)) {
      this.editor.setSelectedShapes([existingShape.id]);
    } else {
      this.editor.setSelectedShapes([]);
      this.editor.setHoveredShape(null);
    }
  }

  override onPointerMove(): void {
    if (
      this.editor.getSelectedShapes().length &&
      this.editor.inputs.isDragging
    ) {
      this.editor.setCurrentTool("select.translating");
      return;
    }

    const { currentPagePoint } = this.editor.inputs;

    const existingShape = this.editor.getShapeAtPoint(currentPagePoint, {
      margin: DEFAULT_ROUTE_RADIUS,
      hitFrameInside: true,
      hitInside: true,
    });

    if (existingShape && isRouteShape(existingShape)) {
      this.editor.setCursor({ type: "default" });
    } else {
      this.editor.setCursor({ type: "grab" });
    }

    if (this.editor.inputs.isDragging) {
      this.parent.transition("dragging");
    }
  }

  override onLongPress() {
    if (this.editor.getSelectedShapes().length) {
      this.editor.setCurrentTool("select.translating");
      return;
    }
    this.parent.transition("dragging");
  }

  override onDoubleClick(): void {
    const { currentPagePoint } = this.editor.inputs;

    const existingShape = this.editor.getShapeAtPoint(currentPagePoint, {
      margin: DEFAULT_ROUTE_RADIUS,
      hitFrameInside: true,
      hitInside: true,
    });

    if (existingShape && isRouteShape(existingShape)) {
      this.editor.deleteShapes([existingShape.id]);
    }
  }

  override onCancel() {
    this.parent.transition("idle");
  }

  override onComplete() {
    this.parent.transition("idle");
  }

  override onInterrupt() {
    this.parent.transition("idle");
  }
}

export class AdminHandTool extends StateNode {
  static override id = "admin-hand-tool";
  static override initial = "idle";
  static override isLockable = false;
  static override children(): TLStateNodeConstructor[] {
    return [Idle, Dragging];
  }
}
