"use client";

import React, { useEffect } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "lg",
}: ModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isFull = maxWidth === "full";

  const maxWidthClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-3xl",
    "2xl": "max-w-4xl",
    "3xl": "max-w-5xl",
    "4xl": "max-w-6xl",
    "5xl": "max-w-7xl",
    full: "w-screen h-screen max-w-none max-h-none",
  }[maxWidth];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isFull ? "p-0" : "p-2 sm:p-4"
      } overflow-y-auto animate-in fade-in duration-150`}
    >
      {/* Backdrop */}
      {!isFull && (
        <div
          className="fixed inset-0 bg-black/55 backdrop-blur-xs transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${
          isFull
            ? "w-screen h-screen max-w-none max-h-none rounded-none border-0 shadow-none m-0"
            : `${maxWidthClasses} rounded-3xl shadow-2xl border border-white/80 max-h-[90vh] my-auto`
        } bg-white/95 backdrop-blur-2xl overflow-hidden z-10 flex flex-col`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-white/70 bg-white/40">
          <div className="flex flex-col gap-1 pr-6">
            <h2 className="text-lg font-extrabold text-[#2d2410] tracking-tight">
              {title}
            </h2>
            {description && (
              <p className="text-xs text-[#7d7152] leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors text-lg font-bold"
            aria-label="Tutup modal"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-sm text-[#2d2410]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/70 bg-white/40">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
