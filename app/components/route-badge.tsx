import { cn } from "@/lib/utils";
import { routeVariants } from "./route-variants";

export function RouteBadge({
  color,
  children,
  className,
}: {
  color: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        routeVariants({
          color,
          className: "flex items-center justify-center",
        }),
        className
      )}
    >
      {children}
    </div>
  );
}
