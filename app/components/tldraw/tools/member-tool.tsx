import {
  StateNode,
  type TLPointerEventInfo,
  type TLStateNodeConstructor,
  Vec,
} from "tldraw";
import {
  DEFAULT_ROUTE_RADIUS,
  isRouteShape,
} from "../shape-utils/route-shape-util";

export class MemberTool extends StateNode {
  static override id = "member-tool";
  static override initial = "idle";
  static override isLockable = false;
  static override children(): TLStateNodeConstructor[] {
    return [Idle, Pointing];
  }
}

class Idle extends StateNode {
  static override id = "idle";

  override onEnter() {
    this.editor.setCursor({ type: "grab", rotation: 0 });
  }

  override onPointerDown(info: TLPointerEventInfo) {
    this.parent.transition("pointing", info);
  }

  override onCancel() {
    this.editor.setCurrentTool("select");
  }
}

export class Pointing extends StateNode {
  static override id = "pointing";

  override onEnter() {
    this.editor.stopCameraAnimation();
    this.editor.setCursor({ type: "grabbing", rotation: 0 });

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

  override onPointerUp() {
    this.complete();
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
