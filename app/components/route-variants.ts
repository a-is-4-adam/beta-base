import { cva, type VariantProps } from "class-variance-authority";

export const routeVariants = cva(
  [
    "relative size-10 border-2 rounded-full overflow-hidden group bg-[var(--route-bg)] border-[var(--route-border)] ",
    "hover:cursor-pointer",
    "data-[selected]:ring-2 data-[selected]:ring-offset-2 data-[selected]:border-0 data-[selected]:ring-[var(--route-ring)] stroke-[var(--route-stroke)] stroke-2",
  ],
  {
    variants: {
      color: {
        yellow:
          "[--route-bg:#FFE629] [--route-border:#ccb400] [--route-ring:#ccb400]",
        teal: "[--route-bg:#7DCEDC] [--route-border:#33acc1] [--route-ring:#33acc1]",
        blue: "[--route-bg:#0090FF] [--route-border:#005799] [--route-ring:#005799]",
        purple:
          "[--route-bg:#9049FF] [--route-border:#5600e0] [--route-ring:#5600e0]",
        pink: "[--route-bg:#fb64b6] [--route-border:#f40689] [--route-ring:#f40689]",
        green:
          "[--route-bg:#5BB98B] [--route-border:#347958] [--route-ring:#347958]",
        red: "[--route-bg:#fb2c36] [--route-border:#be040d] [--route-ring:#be040d]",
        black: "[--route-bg:#333] [--route-border:black] [--route-ring:black]",
        white:
          "[--route-bg:white] [--route-border:#ccc] [--route-ring:#ccc] data-[selected]:border-[#e6e6e6] data-[selected]:border-2",
      },
      stroke: {
        yellow: " [--route-stroke:#ccb400]",
        teal: "[--route-stroke:#33acc1]",
        blue: " [--route-stroke:#005799]",
        purple: " [--route-stroke:#5600e0]",
        pink: "[--route-stroke:#f40689]",
        green: "[--route-stroke:#347958]",
        red: "[ [--route-stroke:#be040d]",
        black: "[--route-stroke:black]",
        white: " [--route-stroke:#ccc] ",
      },
    },
  }
);
