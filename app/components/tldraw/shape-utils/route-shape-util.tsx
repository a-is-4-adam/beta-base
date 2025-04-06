import { routeColor, routeVariants } from "@/components/route-variants";
import { cn } from "@/lib/utils";
import type { Log } from "@prisma/client";
import { CheckIcon } from "lucide-react";
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

export const DEFAULT_ROUTE_RADIUS = 15;
export const DEFAULT_ROUTE_COLOR = "yellow";
export const DEFAULT_ROUTE_GRADE = "VB";
export const ROUTE_SHAPE = "route";

export type RouteShape = TLBaseShape<
  typeof ROUTE_SHAPE,
  {
    id: string;
    radius: number;
    color: string;
    grade: string;
    sector?: string;
    status?: Log["status"];
  }
>;

export class RouteShapeUtil extends ShapeUtil<RouteShape> {
  static override type = ROUTE_SHAPE;
  static override props: RecordProps<RouteShape> = {
    id: T.string,
    radius: T.number,
    color: T.string,
    grade: T.string,
    sector: T.optional(T.string),
    status: T.optional(T.literalEnum("SEND", "FLASH")),
  };

  getDefaultProps(): RouteShape["props"] {
    return {
      id: "",
      radius: DEFAULT_ROUTE_RADIUS,
      color: DEFAULT_ROUTE_COLOR,
      grade: DEFAULT_ROUTE_GRADE,
      sector: undefined,
      status: undefined,
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
          className={routeVariants({
            color: shape.props.color,
          })}
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
        {shape.props.status ? (
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center text-xs font-semibold uppercase text-background",
              routeColor({ color: shape.props.color })
            )}
          >
            <CheckIcon className="size-4" />
          </span>
        ) : (
          <span className="absolute inset-0 flex justify-center items-center text-xs font-semibold uppercase text-background">
            {shape.props.grade}
          </span>
        )}
      </HTMLContainer>
    );
  }

  indicator(shape: RouteShape) {
    return (
      <circle
        // @ts-expect-error TODO fix this
        className={routeVariants({ color: shape.props.color })}
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
