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
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none gap-2";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs h-8",
    md: "px-4 py-2 text-sm h-10",
    lg: "px-5 py-2.5 text-base h-12",
  }[size];

  const variantClasses = {
    primary:
      "bg-[#052552] text-white hover:bg-[#0b3b73] shadow-sm hover:shadow active:scale-[0.98]",
    gold:
      "bg-[#ffc400] text-[#052552] font-bold hover:bg-[#e6b000] shadow-sm hover:shadow active:scale-[0.98]",
    secondary:
      "bg-[#f0f3f8] text-[#052552] hover:bg-[#e2e7f0] active:scale-[0.98]",
    outline:
      "border border-[#d0d7e2] text-[#052552] bg-white hover:bg-[#f8f9fb] active:scale-[0.98]",
    ghost:
      "text-[#58708d] hover:text-[#052552] hover:bg-[#f0f3f8] active:scale-[0.98]",
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
