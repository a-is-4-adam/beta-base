import { cva, type VariantProps } from "class-variance-authority";

export const routeColor = cva("", {
  variants: {
    color: {
      yellow:
        "[--route-bg:#FFE629] [--route-border:#ccb400] [--route-ring:#ccb400]",
      teal: "[--route-bg:#5aadbb] [--route-border:#167687] [--route-ring:#167687] text-white [&+*]:text-white",
      blue: "[--route-bg:#0090FF] [--route-border:#005799] [--route-ring:#005799]  text-white [&+*]:text-white",
      purple:
        "[--route-bg:#9049FF] [--route-border:#5600e0] [--route-ring:#5600e0]  text-white [&+*]:text-white",
      pink: "[--route-bg:#f22c97] [--route-border:#9a0052] [--route-ring:#9a0052]  text-white [&+*]:text-white",
      green:
        "[--route-bg:#5BB98B] [--route-border:#347958] [--route-ring:#347958] text-white [&+*]:text-white",
      red: "[--route-bg:#fb2c36] [--route-border:#be040d] [--route-ring:#be040d]  text-white [&+*]:text-white",
      black:
        "[--route-bg:#333] [--route-border:black] [--route-ring:black]  text-white [&+*]:text-white",
      white:
        "[--route-bg:white] [--route-border:#ccc] [--route-ring:#ccc]  data-[selected]:border-[#e6e6e6] data-[selected]:border-2",
      wood: "[--route-bg:#bd6f13] [--route-border:#e4810c] [--route-ring:#e4810c] [--route-stroke:#e4810c] text-white [&+*]:text-white",
    },
  },
});

export const routeVariants = cva(
  [
    "relative size-10 border-2 rounded-full overflow-hidden group bg-[var(--route-bg)] text-background font-bold border-[var(--route-border)]",
    "hover:cursor-pointer",
    "data-[selected]:ring-2 data-[selected]:ring-offset-2 data-[selected]:ring-offset-transparent data-[selected]:border-0 data-[selected]:ring-[var(--route-ring)] stroke-[var(--route-stroke)] stroke-2",
  ],
  {
    variants: {
      color: {
        yellow:
          "[--route-bg:#FFE629] [--route-border:#ccb400] [--route-ring:#ccb400] [--route-stroke:#ccb400]",
        teal: "[--route-bg:#5aadbb] [--route-border:#167687] [--route-ring:#167687] text-white [&+*]:text-white [--route-stroke:#33acc1]",
        blue: "[--route-bg:#0090FF] [--route-border:#005799] [--route-ring:#005799]  text-white [&+*]:text-white [--route-stroke:#005799]",
        purple:
          "[--route-bg:#9049FF] [--route-border:#5600e0] [--route-ring:#5600e0]  text-white [&+*]:text-white [--route-stroke:#5600e0]",
        pink: "[--route-bg:#f22c97] [--route-border:#9a0052] [--route-ring:#9a0052]  text-white [&+*]:text-white [--route-stroke:#f40689]",
        green:
          "[--route-bg:#5BB98B] [--route-border:#347958] [--route-ring:#347958] text-white [&+*]:text-white [--route-stroke:#347958]",
        red: "[--route-bg:#fb2c36] [--route-border:#be040d] [--route-ring:#be040d]  text-white [&+*]:text-white [--route-stroke:#be040d]",
        black:
          "[--route-bg:#333] [--route-border:black] [--route-ring:black]  text-white [&+*]:text-white [--route-stroke:black]",
        white:
          "[--route-bg:white] [--route-border:#ccc] [--route-ring:#ccc]  data-[selected]:border-[#e6e6e6] data-[selected]:border-2  [--route-stroke:#ccc]",
        wood: "[--route-bg:#bd6f13] [--route-border:#e4810c] [--route-ring:#e4810c] [--route-stroke:#e4810c] text-white [&+*]:text-white",
      },
    },
  }
);
