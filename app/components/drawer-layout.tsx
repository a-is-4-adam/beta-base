import { motion, useAnimate } from "framer-motion";

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
};

const DrawerContext = React.createContext<
  | {
      previewRef: HTMLDivElement | null;
      setPreviewRef: (el: HTMLDivElement) => void;
      close: () => void;
      open: () => void;
      isOpen: boolean;
    }
  | undefined
>(undefined);

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [previewRef, setPreviewRef] = React.useState<HTMLDivElement | null>(
    null
  );

  const [isOpen, setIsOpen] = React.useState(false);

  const close = async () => {
    setIsOpen(false);
  };

  const open = async () => {
    setIsOpen(true);
  };

  return (
    <DrawerContext
      value={{
        previewRef,
        setPreviewRef,
        close,
        open,
        isOpen,
      }}
    >
      {children}
    </DrawerContext>
  );
}

export function useDrawerContext() {
  const ctx = React.useContext(DrawerContext);

  if (!ctx) {
    throw new Error("useDrawerContext must be used withing DrawerProvider");
  }

  return ctx;
}

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
  const { previewRef, setPreviewRef, close, open, isOpen } = useDrawerContext();

  const [scope, animate] = useAnimate();

  const previewHeight =
    (previewRef?.getBoundingClientRect().height ?? 0) + DRAG_HANDLE_HEIGHT;
  console.log("🚀 ~ DrawerLayoutInner ~ previewHeight:", previewHeight);

  return (
    <>
      <div
        style={{
          height: previewHeight,
        }}
      />
      <motion.div
        ref={scope}
        initial={false}
        animate={{
          y: isOpen ? 0 : window.innerHeight - previewHeight,
        }}
        transition={staticTransition}
        drag="y"
        dragConstraints={{
          top: 0,
          bottom: window.innerHeight - previewHeight,
        }}
        onDragEnd={(e, { offset, velocity }) => {
          if (offset.y > window.innerHeight * 0.75 || velocity.y > 10) {
            if (!isOpen) {
              animate(scope.current, {
                y: window.innerHeight - previewHeight,
              });
            }
            close();
          } else {
            if (isOpen) {
              animate(scope.current, { y: 0 });
            }
            open();
          }
        }}
        className={cn(
          "absolute bg-background bottom-0 left-0 right-0 min-h-full border border-muted-foreground rounded-tl-lg rounded-tr-lg flex flex-col z-300",
          previewRef ? "visible" : "invisible"
        )}
      >
        <DragHandle />
        <div className="flex-1">
          <div
            ref={(ref) => {
              console.log(
                "🚀 ~ DrawerLayoutInner ~ ref:",
                ref,
                ref?.getBoundingClientRect().height
              );
              if (!ref) {
                return;
              }
              setPreviewRef(ref);
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
      className="relative flex flex-shrink-0 items-center justify-center w-full"
      style={{ height: `${DRAG_HANDLE_HEIGHT}px` }}
    >
      <div className="w-12 rounded-full h-1.5 bg-gray-400" />
    </div>
  );
}
