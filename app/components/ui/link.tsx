import { type VariantProps } from "class-variance-authority";
import {
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
  composeRenderProps,
} from "react-aria-components";

import { cn } from "@/lib/utils";

import { buttonVariants } from "./button";

type LinkProps = Omit<AriaLinkProps, "href"> & {
  to: string;
} & VariantProps<typeof buttonVariants>;

const Link = ({ className, variant, size, to, ...props }: LinkProps) => {
  return (
    <AriaLink
      href={to}
      className={composeRenderProps(className, (className) => cn(className))}
      {...props}
    />
  );
};

export { Link };
export type { LinkProps };
