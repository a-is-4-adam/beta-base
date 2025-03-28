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

export class AdminHandTool extends StateNode {
  static override id = "admin-hand-tool";
  static override initial = "idle";
  static override isLockable = false;
  static override children(): TLStateNodeConstructor[] {
    return [Idle, Pointing, Dragging];
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

class Pointing extends StateNode {
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

  override onLongPress() {
    this.startDragging();
  }

  override onPointerMove() {
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
      this.startDragging();
    }
  }

  private startDragging() {
    this.parent.transition("dragging");
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

class Dragging extends StateNode {
  static override id = "dragging";

  initialCamera = new Vec();

  override onEnter() {
    this.initialCamera = Vec.From(this.editor.getCamera());
    this.update();
  }

  override onPointerMove() {
    this.update();
  }

  override onPointerUp() {
    this.complete();
  }

  override onCancel() {
    this.parent.transition("idle");
  }

  override onComplete() {
    this.complete();
  }

  private update() {
    const { initialCamera, editor } = this;
    const { currentScreenPoint, originScreenPoint } = editor.inputs;

    const delta = Vec.Sub(currentScreenPoint, originScreenPoint).div(
      editor.getZoomLevel()
    );
    if (delta.len2() === 0) return;
    editor.setCamera(initialCamera.clone().add(delta));
  }

  private complete() {
    const { editor } = this;
    const { pointerVelocity } = editor.inputs;

    const velocityAtPointerUp = Math.min(pointerVelocity.len(), 2);

    if (velocityAtPointerUp > 0.1) {
      this.editor.slideCamera({
        speed: velocityAtPointerUp,
        direction: pointerVelocity,
      });
    }

    this.parent.transition("idle");
  }
}
