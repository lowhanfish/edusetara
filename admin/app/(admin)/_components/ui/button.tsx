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
      "bg-gradient-to-b from-[#ffd666] to-[#eda61a] text-[#3b2a05] shadow-[0_6px_16px_rgba(245,176,46,.35)] hover:brightness-105 active:scale-[0.98]",
    gold:
      "bg-gradient-to-b from-[#ffd666] to-[#eda61a] text-[#3b2a05] shadow-[0_6px_16px_rgba(245,176,46,.35)] hover:brightness-105 active:scale-[0.98]",
    secondary:
      "bg-white/80 text-[#2d2410] border border-white/80 hover:bg-white/90 active:scale-[0.98]",
    outline:
      "border border-white/80 text-[#2d2410] bg-white/60 backdrop-blur hover:bg-white/90 shadow-[0_2px_8px_rgba(170,120,10,.08)] active:scale-[0.98]",
    ghost:
      "text-[#7d7152] hover:text-[#a86a00] hover:bg-white/70 active:scale-[0.98]",
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
