"use client";

import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none gap-2";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs h-8",
    md: "px-4 py-2 text-sm h-10",
    lg: "px-5 py-2.5 text-base h-12",
  }[size];

  const variantClasses = {
    primary:
      "bg-gradient-to-b from-[#8b6dff] to-[#6a49f0] text-white shadow-[0_6px_16px_rgba(124,92,255,.35)] hover:brightness-105 active:scale-[0.98]",
    gold:
      "bg-gradient-to-b from-[#8b6dff] to-[#6a49f0] text-white shadow-[0_6px_16px_rgba(124,92,255,.35)] hover:brightness-105 active:scale-[0.98]",
    secondary:
      "bg-white/60 text-[#1f1b4d] border border-white/80 hover:bg-white/90 active:scale-[0.98]",
    outline:
      "border border-white/80 text-[#1f1b4d] bg-white/60 backdrop-blur hover:bg-white/90 shadow-[0_2px_8px_rgba(88,76,200,.08)] active:scale-[0.98]",
    ghost:
      "text-[#6b6f8f] hover:text-[#5b3fe0] hover:bg-white/70 active:scale-[0.98]",
    danger:
      "bg-[#dc2626] text-white hover:bg-[#b91c1c] shadow-sm active:scale-[0.98]",
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
