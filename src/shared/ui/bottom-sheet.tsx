"use client";

import type { ReactNode } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./drawer";

interface BottomSheetProps {
  children: ReactNode;
  onClose: () => void;
  open: boolean;
  title?: string;
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: BottomSheetProps) {
  return (
    <Drawer
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
      open={open}
    >
      <DrawerContent>
        {title && (
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
        )}
        <div className="px-4 pb-10">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
