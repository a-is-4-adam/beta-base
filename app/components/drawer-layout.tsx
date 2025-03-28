import { motion, useMotionValue, animate } from "framer-motion";

import { ClientOnly } from "./client-only";
import React from "react";
import { cn } from "@/lib/utils";

const staticTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};

const DRAG_HANDLE_HEIGHT = 36;

type DrawerLayoutProps = {
  children?: React.ReactNode;
  preview?: React.ReactNode;
  // isOpen?: boolean;
  // setIsOpen?: (isOpen: boolean) => void;
};

export function DrawerLayout(props: DrawerLayoutProps) {
  return (
    <>
      <ClientOnly>
        <DrawerLayoutInner {...props} />
      </ClientOnly>
    </>
  );
}

function DrawerLayoutInner({ children, preview }: DrawerLayoutProps) {
  const [isRefSet, setIsRefSet] = React.useState(false);

  const previewRef = React.useRef<HTMLDivElement | null>(null);

  const previewHeight =
    (previewRef.current?.getBoundingClientRect().height ?? 0) +
    DRAG_HANDLE_HEIGHT;

  const minYPos = window.innerHeight - previewHeight;

  const y = useMotionValue(minYPos);

  return (
    <>
      <div
        style={{
          height: previewHeight,
        }}
      />
      <motion.div
        initial={false}
        style={{
          y,
        }}
        transition={staticTransition}
        drag="y"
        dragConstraints={{ top: 0, bottom: minYPos }}
        onDragEnd={(e, { offset, velocity }) => {
          if (offset.y > window.innerHeight * 0.75 || velocity.y > 10) {
            animate(y, minYPos);
          } else {
            animate(y, 0);
          }
        }}
        className={cn(
          "absolute bg-background bottom-0 left-0 right-0 min-h-full border border-border rounded-tl-lg rounded-tr-lg flex flex-col z-300",
          isRefSet ? "visible" : "invisible"
        )}
      >
        <div className="flex-shrink-0">
          <DragHandle />
        </div>
        <div className="flex-1">
          <div
            ref={(ref) => {
              setIsRefSet(true);
              y.set(
                window.innerHeight -
                  (ref?.getBoundingClientRect().height ?? 0) -
                  DRAG_HANDLE_HEIGHT
              );
              previewRef.current = ref;
            }}
          >
            {preview}
          </div>

          <div>{children}</div>
        </div>
      </motion.div>
    </>
  );
}

function DragHandle() {
  return (
    <div
      className="relative flex items-center justify-center w-full"
      style={{ height: `${DRAG_HANDLE_HEIGHT}px` }}
    >
      <div className="w-12 rounded-full h-1.5 bg-gray-400" />
    </div>
  );
}
