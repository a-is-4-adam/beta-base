import React from "react";

import { ChevronRight, MoreHorizontal } from "lucide-react";
import {
  Breadcrumb as AriaBreadcrumb,
  Breadcrumbs as AriaBreadcrumbs,
  Link as AriaLink,
  composeRenderProps,
} from "react-aria-components";

import { cn } from "@/lib/utils";

import type {
  BreadcrumbProps as AriaBreadcrumbProps,
  BreadcrumbsProps as AriaBreadcrumbsProps,
  LinkProps as AriaLinkProps,
} from "react-aria-components";

const Breadcrumbs = <T extends object>({
  className,
  ...props
}: AriaBreadcrumbsProps<T>) => (
  <AriaBreadcrumbs
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-foreground sm:gap-2.5",
      className
    )}
    {...props}
  />
);

const BreadcrumbItem = ({ className, ...props }: AriaBreadcrumbProps) => (
  <AriaBreadcrumb
    className={cn("inline-flex items-center gap-1.5 sm:gap-2.5", className)}
    {...props}
  />
);

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, AriaLinkProps>(
  ({ className, ...props }, forwardedRef) => (
    <AriaLink
      ref={forwardedRef}
      className={composeRenderProps(className, (className) =>
        cn(
          "transition-colors",
          /* Hover */
          "data-[hovered]:text-foreground",
          /* Disabled */
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          /* Current */
          "data-[current]:pointer-events-auto data-[current]:opacity-100",
          className
        )
      )}
      {...props}
    />
  )
);

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children || <ChevronRight />}
  </span>
);

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex size-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="size-4" />
    <span className="sr-only">More</span>
  </span>
);

type BreadcrumbPageProps = Omit<AriaLinkProps, "href">;

const BreadcrumbPage = ({ className, ...props }: BreadcrumbPageProps) => (
  <AriaLink
    className={composeRenderProps(className, (className) =>
      cn("font-normal text-foreground", className)
    )}
    {...props}
  />
);

export {
  Breadcrumbs,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
