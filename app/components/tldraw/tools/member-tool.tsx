import { StateNode, type TLStateNodeConstructor, Vec } from "@tldraw/editor";
// import { isRouteShape } from "@/components/tldraw/shapes/route-shape";

export class Dragging extends StateNode {
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

export class Pointing extends StateNode {
  static override id = "pointing";

  override onEnter() {
    this.editor.stopCameraAnimation();

    this.editor.setCursor({ type: "grabbing", rotation: 0 });
  }

  override onPointerMove() {
    if (this.editor.inputs.isDragging) {
      this.parent.transition("dragging");
    }
  }
}

export class Idle extends StateNode {
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

    if (existingShape) {
      this.editor.setSelectedShapes([existingShape.id]);
    }
  }

  override onPointerMove(): void {
    const { currentPagePoint } = this.editor.inputs;

    const existingShapes = this.editor.getShapesAtPoint(currentPagePoint, {
      hitInside: true,
    });

    // if (existingShapes.some(isRouteShape)) {
    if (false) {
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
