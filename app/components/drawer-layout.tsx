import {
  animate,
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Modal, ModalOverlay } from "react-aria-components";
import { createContext, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { ClientOnly } from "./client-only";
import { DialogOverlay, Dialog } from "@/components/ui/dialog";
// import {  } from "react-aria";
const MotionModal = motion.create(Modal);
const MotionModalOverlay = motion.create(ModalOverlay);

const inertiaTransition = {
  type: "inertia" as const,
  bounceStiffness: 300,
  bounceDamping: 40,
  timeConstant: 300,
};

const staticTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};

const SHEET_MARGIN = 34;

type DrawerLayoutProps = {
  children: React.ReactNode;
  preview: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
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

function DrawerLayoutInner({
  isOpen: isOpenProp,
  setIsOpen: setIsOpenProp,
  ...props
}: DrawerLayoutProps) {
  const ref = useRef<HTMLDivElement>(null);
  let [isOpen, setOpen] = useState(false);
  let h = window.innerHeight - SHEET_MARGIN - 86;
  let y = useMotionValue(h);

  let bgOpacity = useTransform(y, [0, h], [0.4, 0]);
  let bg = useMotionTemplate`rgba(0, 0, 0, ${bgOpacity})`;

  useEffect(() => {
    if (isOpenProp) {
      setTimeout(() => {
        // document.getElementById("foo")?.focus();
        console.log(document.activeElement);
        console.log("🚀 ~ useEffect ~ ref.current:", ref.current);
      }, 100);
    }
  }, [isOpen, isOpenProp]);

  return (
    <>
      <motion.div
        className="w-full bg-background z-10 absolute px-4 pb-2 bottom-0 left-0 right-0 border-t-2 border-x-2 shadow-lg border-border rounded-tl-xl rounded-tr-xl"
        drag="y"
        dragConstraints={{ top: 0 }}
        onDragEnd={(e, { offset, velocity }) => {
          if (offset.y < window.innerHeight * 0.1 * -1 || velocity.y > 10) {
            if (setIsOpenProp) {
              setIsOpenProp(true);
            } else {
              setOpen(true);
            }
          }
        }}
      >
        {!(isOpenProp ?? isOpen) ? (
          <>
            <DragHandle />
            {props.preview}
          </>
        ) : null}
      </motion.div>
      <AnimatePresence>
        {(isOpenProp ?? isOpen) && (
          <MotionModalOverlay
            isOpen
            onOpenChange={setIsOpenProp ?? setOpen}
            className="fixed inset-0 z-10"
            style={{ backgroundColor: bg as any }}
          >
            <MotionModal
              className="bg-background absolute bottom-0 w-full rounded-t-xl border-2 shadow-lg will-change-transform px-4 pb-4 outline-none "
              initial={{ y: h }}
              animate={{ y: 0 }}
              exit={{ y: h }}
              transition={staticTransition}
              style={{
                y,
                top: SHEET_MARGIN,
                // Extra padding at the bottom to account for rubber band scrolling.
                paddingBottom: window.screen.height,
              }}
              drag="y"
              dragConstraints={{ top: 0 }}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.y > window.innerHeight * 0.75 || velocity.y > 10) {
                  if (setIsOpenProp) {
                    setIsOpenProp(false);
                  } else {
                    setOpen(false);
                  }
                } else {
                  animate(y, 0, { ...inertiaTransition, min: 0, max: 0 });
                }
              }}
            >
              <DragHandle />
              <div ref={ref}>
                {/* <Dialog className="px-4 pb-4 outline-none relative z-50" > */}
                {props.children}
              </div>
              {/* </Dialog> */}
            </MotionModal>
          </MotionModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
}

function DragHandle() {
  return <div className="mx-auto w-12 my-4 h-1.5 rounded-full bg-gray-400" />;
}
