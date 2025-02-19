import {
  DefaultColorStyle,
  DefaultColorThemePalette,
  Edge2d,
  Polygon2d,
  type RecordPropsType,
  SVGContainer,
  ShapeUtil,
  T,
  type TLBaseShape,
  type TLHandle,
  Vec,
  getIndexAbove,
  getIndexBetween,
  getIndices,
  sortByIndex,
} from "tldraw";

DefaultColorThemePalette.lightMode.black.fill = "black";
DefaultColorThemePalette.lightMode.grey.fill = "#232323";
DefaultColorThemePalette.lightMode["light-violet"].fill = "#606060";
DefaultColorThemePalette.lightMode.violet.fill = "#828282";

export const polygonShapeProps = {
  w: T.number,
  h: T.number,
  points: T.dict(
    T.string,
    T.object({
      id: T.string,
      index: T.indexKey,
      x: T.number,
      y: T.number,
    })
  ),
  fill: DefaultColorStyle,
};

export type PolygonShapeProps = RecordPropsType<typeof polygonShapeProps>;
export type PolygonShape = TLBaseShape<"polygon-shape", PolygonShapeProps>;

export class PolygonShapeUtil extends ShapeUtil<PolygonShape> {
  static override type = "polygon-shape" as const;
  static override props = polygonShapeProps;

  override hideResizeHandles = () => true;
  override hideRotateHandle = () => true;
  override hideSelectionBoundsFg = () => true;
  override hideSelectionBoundsBg = () => true;

  override getDefaultProps(): PolygonShape["props"] {
    const [tl, tr, br, bl] = getIndices(4);
    return {
      w: 100,
      h: 100,
      points: {
        [tl]: { id: tl, index: tl, x: 0, y: 0 },
        [tr]: { id: tr, index: tr, x: 100, y: 0 },
        [br]: { id: br, index: br, x: 100, y: 100 },
        [bl]: { id: bl, index: bl, x: 0, y: 100 },
      },
      fill: "black",
    };
  }

  private polygonPointsToArray(shape: PolygonShape) {
    return Object.values(shape.props.points).sort(sortByIndex);
  }

  private getGeometryForPolygonShape(shape: PolygonShape) {
    return this.polygonPointsToArray(shape).map(Vec.From);
  }

  override getGeometry(shape: PolygonShape) {
    const points = this.getGeometryForPolygonShape(shape);
    return new Polygon2d({ points, isFilled: true });
  }

  override getHandles(shape: PolygonShape) {
    const spline = this.getGeometry(shape);

    const points: TLHandle[] = this.polygonPointsToArray(shape).map(
      (point) => ({
        ...point,
        id: point.index,
        type: "vertex",
        canSnap: true,
      })
    );

    const results: TLHandle[] = [...points];

    for (let i = 0; i < points.length; i++) {
      if (i === points.length - 1) {
        const finalEdge = new Edge2d({
          start: new Vec(points[i].x, points[i].y),
          end: new Vec(points[0].x, points[0].y),
        });
        const midPoint = finalEdge.midPoint();
        const index = getIndexAbove(points[i].index);

        results.push({
          id: index,
          type: "vertex",
          index,
          x: midPoint.x,
          y: midPoint.y,
          canSnap: true,
        });
      } else {
        const startIndex = points[i].index;
        const endIndex = points[i + 1]?.index ?? getIndexAbove(points[i].index);

        const index = getIndexBetween(startIndex, endIndex);
        const segment = spline.segments[i];
        const point = segment.midPoint();
        results.push({
          id: index,
          type: "vertex",
          index,
          x: point.x,
          y: point.y,
          canSnap: true,
        });
      }
    }

    return results.sort(sortByIndex);
  }

  override onHandleDrag = (
    shape: PolygonShape,
    { handle }: { handle: TLHandle }
  ) => {
    // we should only ever be dragging vertex handles
    if (handle.type !== "vertex") return;

    return {
      ...shape,
      props: {
        ...shape.props,
        points: {
          ...shape.props.points,
          [handle.id]: {
            id: handle.id,
            index: handle.index,
            x: handle.x,
            y: handle.y,
          },
        },
      },
    };
  };

  override onDoubleClickHandle = (shape: PolygonShape, handle: TLHandle) => {
    const { [handle.id]: _, ...points } = shape.props.points;

    return {
      ...shape,
      props: {
        ...shape.props,
        points,
      },
    };
  };

  component(shape: PolygonShape) {
    const vertices = this.getGeometryForPolygonShape(shape);
    const pathData = "M" + vertices[0] + "L" + vertices.slice(1) + "Z";

    return (
      <SVGContainer
        id={shape.id}
        fill={DefaultColorThemePalette.lightMode[shape.props.fill].fill}
      >
        <path d={pathData} />;
      </SVGContainer>
    );
  }

  indicator(shape: PolygonShape) {
    const vertices = this.getGeometryForPolygonShape(shape);
    const pathData = "M" + vertices[0] + "L" + vertices.slice(1) + "Z";
    return <path d={pathData} />;
  }
}
