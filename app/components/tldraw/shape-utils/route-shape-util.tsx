import { routeVariants } from "@/components/route-variants";
import {
  Circle2d,
  Geometry2d,
  HTMLContainer,
  type RecordProps,
  ShapeUtil,
  T,
  type TLBaseShape,
  type TLShape,
} from "tldraw";

export const DEFAULT_ROUTE_RADIUS = 20;
export const DEFAULT_ROUTE_COLOR = "yellow";
export const DEFAULT_ROUTE_GRADE = "v0";
export const ROUTE_SHAPE = "route";

export type RouteShape = TLBaseShape<
  typeof ROUTE_SHAPE,
  {
    id: string | undefined;
    radius: number;
    color: string;
    grade: string;
    sector?: string;
  }
>;

export class RouteShapeUtil extends ShapeUtil<RouteShape> {
  static override type = ROUTE_SHAPE;
  static override props: RecordProps<RouteShape> = {
    id: T.optional(T.string),
    radius: T.number,
    color: T.string,
    grade: T.string,
    sector: T.optional(T.string),
  };

  getDefaultProps(): RouteShape["props"] {
    return {
      id: undefined,
      radius: DEFAULT_ROUTE_RADIUS,
      color: DEFAULT_ROUTE_COLOR,
      grade: DEFAULT_ROUTE_GRADE,
      sector: undefined,
    };
  }

  override canEdit() {
    return false;
  }
  override canResize() {
    return false;
  }

  override hideRotateHandle() {
    return true;
  }

  getGeometry(shape: RouteShape): Geometry2d {
    return new Circle2d({
      radius: shape.props.radius,
      isFilled: true,
    });
  }

  component(shape: RouteShape) {
    return (
      <HTMLContainer className="relative">
        <svg
          // @ts-expect-error TODO fix this
          className={routeVariants({ color: shape.props.color })}
          width={shape.props.radius * 2}
          height={shape.props.radius * 2}
          fill="var(--route-bg)"
        >
          <circle
            cx={shape.props.radius}
            cy={shape.props.radius}
            r={shape.props.radius + 2}
          ></circle>
        </svg>
        <span className="absolute inset-0 content-center text-center text-xs font-semibold uppercase">
          {shape.props.grade}
        </span>
      </HTMLContainer>
    );
  }

  indicator(shape: RouteShape) {
    return (
      <circle
        // @ts-expect-error TODO fix this
        className={routeVariants({ stroke: shape.props.color })}
        cx={shape.props.radius}
        cy={shape.props.radius}
        r={shape.props.radius + 2}
      />
    );
  }
}

export function isRouteShape(shape: TLShape | undefined): shape is RouteShape {
  return shape?.type === ROUTE_SHAPE;
}
