"use client";

import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  // Close on ESC
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-xl relative z-10">
        {children}
      </div>
    </div>,
    modalRoot,
  );
}
