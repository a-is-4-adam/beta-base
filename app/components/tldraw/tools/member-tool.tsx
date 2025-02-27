import { StateNode, type TLStateNodeConstructor, Vec } from "@tldraw/editor";
import { isRouteShape } from "@/components/tldraw/shape-utils/route-shape-util";
import { Dragging } from "./state-nodes/dragging";

class Idle extends StateNode {
  static override id = "idle";

  override onEnter() {
    this.editor.setCursor({ type: "grab", rotation: 0 });
  }

  override onPointerDown(): void {
    const { currentPagePoint } = this.editor.inputs;

    const existingShape = this.editor.getShapeAtPoint(currentPagePoint, {
      hitFrameInside: true,
      hitInside: true,
    });

    if (existingShape && isRouteShape(existingShape)) {
      this.editor.setSelectedShapes([existingShape.id]);
    } else {
      this.editor.setSelectedShapes([]);
    }
  }

  override onPointerMove(): void {
    const { currentPagePoint } = this.editor.inputs;

    const existingShapes = this.editor.getShapesAtPoint(currentPagePoint, {
      hitInside: true,
    });

    if (existingShapes.some(isRouteShape)) {
      this.editor.setCursor({ type: "default" });
    } else {
      this.editor.setCursor({ type: "grab" });
    }

    if (this.editor.inputs.isDragging) {
      this.parent.transition("dragging");
    }
  }

  override onLongPress() {
    this.parent.transition("dragging");
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

export class MemberTool extends StateNode {
  static override id = "member-tool";
  static override initial = "idle";
  static override isLockable = false;
  static override children(): TLStateNodeConstructor[] {
    return [Idle, Dragging];
  }
}
